// CalorieCalculation 엔티티:


// 사용자의 칼로리 계산 결과 저장
// 계산 날짜, 입력 음식 목록, 총 칼로리 등 포함
// 영양 목표 달성 추적에 활용
// 연관 관계:

// User와 N:1 관계 (여러 계산 결과가 한 사용자에 속함)
// MealRecord, FoodDatabase와 관련됨

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsDate } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class CalorieCalculation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.calorieCalculations)
  user: User;

  @Column()
  @IsNotEmpty({ message: '계산 날짜는 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  calculationDate: Date;

  // 음식 목록 및 영양 정보
  @Column('simple-json')
  @IsNotEmpty({ message: '음식 목록은 필수입니다.' })
  foodItems: { [foodName: string]: number }; // 음식 이름과 그램 수

  @Column('float')
  @IsNumber({}, { message: '총 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '총 칼로리는 0 이상이어야 합니다.' })
  totalCalories: number;

  @Column('simple-json')
  nutritionBreakdown: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  // 칼로리 계산 메서드
  calculateCalories(foodDatabase: { [foodName: string]: { caloriesPer100g: number, nutritionPer100g: any } }): void {
    this.totalCalories = 0;
    this.nutritionBreakdown = { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 };

    for (const [foodName, grams] of Object.entries(this.foodItems)) {
      if (foodDatabase[foodName]) {
        const factor = grams / 100;
        this.totalCalories += foodDatabase[foodName].caloriesPer100g * factor;

        for (const nutrient of Object.keys(this.nutritionBreakdown)) {
          this.nutritionBreakdown[nutrient] += foodDatabase[foodName].nutritionPer100g[nutrient] * factor;
        }
      }
    }

    // 소수점 둘째 자리까지 반올림
    this.totalCalories = Number(this.totalCalories.toFixed(2));
    for (const nutrient of Object.keys(this.nutritionBreakdown)) {
      this.nutritionBreakdown[nutrient] = Number(this.nutritionBreakdown[nutrient].toFixed(2));
    }
  }

  // 영양 분석 요약 생성 메서드
  generateNutritionSummary(): string {
    let summary = `칼로리 계산 결과 (${this.calculationDate.toLocaleDateString()})\n\n`;
    summary += `총 칼로리: ${this.totalCalories} kcal\n\n`;
    summary += '영양 성분 분석:\n';
    for (const [nutrient, amount] of Object.entries(this.nutritionBreakdown)) {
      summary += `- ${nutrient}: ${amount}g\n`;
    }
    summary += '\n음식 목록:\n';
    for (const [foodName, grams] of Object.entries(this.foodItems)) {
      summary += `- ${foodName}: ${grams}g\n`;
    }
    return summary;
  }
}