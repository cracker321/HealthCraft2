// MealRecord 엔티티:


// 사용자의 실제 식사 내역을 상세히 기록
// 각 식사의 시간, 유형, 구성 정보 포함
// 섭취한 음식의 종류와 양 기록
// 섭취한 음식에 대한 영양 정보 계산 및 저장
// 실제 영양 섭취와 권장 섭취량 비교에 활용
// 식사 패턴 분석 및 개인화된 조언 제공에 사용
// 사진 첨부 기능 고려(시각적 기록)
// 사용자의 식습관 변화 추적에 활용
// 연관 관계:

// User와 N:1 관계 (여러 식사 기록이 한 사용자에 속함)
// FoodDatabase와 M:N 관계 (하나의 식사 기록은 여러 음식을 포함할 수 있고, 하나의 음식은 여러 식사 기록에 포함될 수 있음)

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsDate, IsEnum, IsNumber, Min } from 'class-validator';
import { User } from './user.entity';
import { FoodDatabase } from './food-database.entity';

@Entity()
export class MealRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.mealRecords)
  user: User;

  // 식사 정보
  @Column()
  @IsNotEmpty({ message: '식사 시간은 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  eatenAt: Date;

  @Column()
  @IsNotEmpty({ message: '식사 유형은 필수입니다.' })
  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'], { message: '유효한 식사 유형이 아닙니다.' })
  mealType: string;

  // 음식 항목과의 다대다 관계
  @ManyToMany(() => FoodDatabase)
  @JoinTable()
  foodItems: FoodDatabase[];

  // 각 음식 항목의 섭취량
  @Column('simple-json')
  portions: { [foodId: string]: number };

  // 영양 정보 합계
  @Column('float')
  @IsNumber({}, { message: '총 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '총 칼로리는 0 이상이어야 합니다.' })
  totalCalories: number;

  @Column('float')
  @IsNumber({}, { message: '총 단백질은 숫자여야 합니다.' })
  @Min(0, { message: '총 단백질은 0 이상이어야 합니다.' })
  totalProtein: number;

  @Column('float')
  @IsNumber({}, { message: '총 탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '총 탄수화물은 0 이상이어야 합니다.' })
  totalCarbs: number;

  @Column('float')
  @IsNumber({}, { message: '총 지방은 숫자여야 합니다.' })
  @Min(0, { message: '총 지방은 0 이상이어야 합니다.' })
  totalFat: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  // 식사 영양 정보 계산 메서드
  calculateNutrition() {
    this.totalCalories = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;

    this.foodItems.forEach(food => {
      const portion = this.portions[food.id] || 1;
      this.totalCalories += food.calories * portion;
      this.totalProtein += food.protein * portion;
      this.totalCarbs += food.carbs * portion;
      this.totalFat += food.fat * portion;
    });
  }

  // 식사 기록에 음식 추가 메서드
  addFoodItem(foodItem: FoodDatabase, portion: number) {
    this.foodItems.push(foodItem);
    this.portions[foodItem.id] = portion;
    this.calculateNutrition();
  }

  // 식사 기록에서 음식 제거 메서드
  removeFoodItem(foodItemId: string) {
    this.foodItems = this.foodItems.filter(item => item.id !== foodItemId);
    delete this.portions[foodItemId];
    this.calculateNutrition();
  }
}