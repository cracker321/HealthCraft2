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
import { IsNotEmpty, IsDate, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { FoodDatabase } from './food-database.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class MealRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.mealRecords)
  user: User;

  @Column()
  @IsNotEmpty({ message: '식사 시간은 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  eatenAt: Date;

  @Column()
  @IsNotEmpty({ message: '식사 유형은 필수입니다.' })
  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'], { message: '유효한 식사 유형이 아닙니다.' })
  mealType: string;

  @ManyToMany(() => FoodDatabase)
  @JoinTable()
  foodItems: FoodDatabase[];

  @ManyToMany(() => Recipe)
  @JoinTable()
  recipes: Recipe[];

  @Column('simple-json')
  portions: { [foodId: string]: number };

  @Column('simple-json')
  recipeServings: { [recipeId: string]: number };

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
  @IsOptional()
  notes?: string;

  @Column({ nullable: true })
  @IsOptional()
  photoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  // 식사 영양 정보 계산 메서드
  calculateNutrition() {
    this.totalCalories = 0;
    this.totalProtein = 0;
    this.totalCarbs = 0;
    this.totalFat = 0;

    // 개별 음식 항목에 대한 계산
    this.foodItems.forEach(food => {
      const portion = this.portions[food.id] || 1;
      this.totalCalories += food.caloriesPer100g * portion / 100;
      this.totalProtein += food.proteinPer100g * portion / 100;
      this.totalCarbs += food.carbsPer100g * portion / 100;
      this.totalFat += food.fatPer100g * portion / 100;
    });

    // 레시피에 대한 계산
    this.recipes.forEach(recipe => {
      const servings = this.recipeServings[recipe.id] || 1;
      this.totalCalories += recipe.calories * servings;
      this.totalProtein += recipe.protein * servings;
      this.totalCarbs += recipe.carbs * servings;
      this.totalFat += recipe.fat * servings;
    });

    // 소수점 둘째 자리까지 반올림
    this.totalCalories = Number(this.totalCalories.toFixed(2));
    this.totalProtein = Number(this.totalProtein.toFixed(2));
    this.totalCarbs = Number(this.totalCarbs.toFixed(2));
    this.totalFat = Number(this.totalFat.toFixed(2));
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

  // 식사 기록에 레시피 추가 메서드
  addRecipe(recipe: Recipe, servings: number) {
    this.recipes.push(recipe);
    this.recipeServings[recipe.id] = servings;
    this.calculateNutrition();
  }

  // 식사 기록에서 레시피 제거 메서드
  removeRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
    delete this.recipeServings[recipeId];
    this.calculateNutrition();
  }

  // 식사 요약 생성 메서드
  generateSummary(): string {
    let summary = `식사 기록 (${this.eatenAt.toLocaleString()})\n`;
    summary += `식사 유형: ${this.mealType}\n\n`;
    
    if (this.foodItems.length > 0) {
      summary += "음식 항목:\n";
      this.foodItems.forEach(food => {
        summary += `- ${food.name}: ${this.portions[food.id]}g\n`;
      });
    }
    
    if (this.recipes.length > 0) {
      summary += "\n레시피:\n";
      this.recipes.forEach(recipe => {
        summary += `- ${recipe.name}: ${this.recipeServings[recipe.id]} 인분\n`;
      });
    }
    
    summary += `\n총 영양 정보:\n`;
    summary += `칼로리: ${this.totalCalories} kcal\n`;
    summary += `단백질: ${this.totalProtein}g\n`;
    summary += `탄수화물: ${this.totalCarbs}g\n`;
    summary += `지방: ${this.totalFat}g\n`;
    
    if (this.notes) {
      summary += `\n비고: ${this.notes}\n`;
    }
    
    return summary;
  }
}