// NutritionPlan 엔티티:


// 개인화된 영양 계획의 중심 엔티티
// 사용자의 건강 프로필과 목표를 바탕으로 생성
// 전체 칼로리 및 세부 영양소별 목표 설정
// 계획의 시작일과 종료일 포함(단기/장기 목표 설정 가능)
// 권장 식품 및 피해야 할 식품 목록 제공
// 식사별 영양 분배 비율 설정
// 정기적인 리뷰 및 조정 가능한 구조
// 사용자 진행 상황에 따른 동적 업데이트 고려
// 연관 관계:

// User와 N:1 관계 (여러 영양 계획이 한 사용자에 속함)
// Recipe와 M:N 관계 (하나의 계획은 여러 레시피를 포함할 수 있고, 하나의 레시피는 여러 계획에 포함될 수 있음)
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsDate, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { HealthProfile } from './health-profile.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class NutritionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자 및 건강 프로필과의 다대일 관계
  @ManyToOne(() => User, user => user.nutritionPlans)
  user: User;

  @ManyToOne(() => HealthProfile, healthProfile => healthProfile.nutritionPlans)
  healthProfile: HealthProfile;

  // 계획 시작일 및 종료일
  @Column()
  @IsNotEmpty({ message: '계획 시작일은 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  startDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  endDate?: Date;

  // 일일 영양 목표
  @Column('int')
  @IsNotEmpty({ message: '일일 칼로리 목표는 필수입니다.' })
  @IsNumber({}, { message: '일일 칼로리 목표는 숫자여야 합니다.' })
  @Min(500, { message: '일일 칼로리 목표는 최소 500kcal 이상이어야 합니다.' })
  dailyCalorieTarget: number;

  @Column('float')
  @IsNotEmpty({ message: '단백질 목표는 필수입니다.' })
  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0g 이상이어야 합니다.' })
  proteinTarget: number;

  @Column('float')
  @IsNotEmpty({ message: '탄수화물 목표는 필수입니다.' })
  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0g 이상이어야 합니다.' })
  carbTarget: number;

  @Column('float')
  @IsNotEmpty({ message: '지방 목표는 필수입니다.' })
  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0g 이상이어야 합니다.' })
  fatTarget: number;

  // 식사 분배 및 식품 추천/제한 정보
  @Column('simple-json')
  mealDistribution: { [key: string]: number };

  @Column('simple-array')
  recommendedFoods: string[];

  @Column('simple-array')
  foodsToAvoid: string[];

  // 추천 레시피와의 다대다 관계
  @ManyToMany(() => Recipe)
  @JoinTable()
  recommendedRecipes: Recipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 영양 목표 달성도 계산 메서드
  calculateNutritionGoalProgress(consumedCalories: number, consumedProtein: number, consumedCarbs: number, consumedFat: number) {
    return {
      calorieProgress: (consumedCalories / this.dailyCalorieTarget) * 100,
      proteinProgress: (consumedProtein / this.proteinTarget) * 100,
      carbProgress: (consumedCarbs / this.carbTarget) * 100,
      fatProgress: (consumedFat / this.fatTarget) * 100
    };
  }

  // 영양 계획에 레시피 추가 메서드
  addRecipe(recipe: Recipe) {
    if (!this.recommendedRecipes.find(r => r.id === recipe.id)) {
      this.recommendedRecipes.push(recipe);
    }
  }

  // 영양 계획에서 레시피 제거 메서드
  removeRecipe(recipeId: string) {
    this.recommendedRecipes = this.recommendedRecipes.filter(r => r.id !== recipeId);
  }
}