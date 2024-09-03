// FoodDatabase 엔티티:


// 다양한 음식에 대한 상세 영양 정보 저장
// 음식 이름, 분류, 영양소 함량, 알레르기 정보 등 포함
// 식단 계획, 칼로리 계산, 영양 분석 등에 활용
// 연관 관계:

// MealRecord, Recipe, Ingredient 엔티티들과 관련됨
// 자체적으로 계층 구조를 가질 수 있음 (예: 식품 카테고리)
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsArray } from 'class-validator';

@Entity()
export class FoodDatabase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 음식 기본 정보
  @Column()
  @IsNotEmpty({ message: '음식 이름은 필수입니다.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: '음식 분류는 필수입니다.' })
  category: string;

  // 영양 정보 (100g 기준)
  @Column('float')
  @IsNumber({}, { message: '100g당 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  caloriesPer100g: number;

  @Column('float')
  @IsNumber({}, { message: '단백질 함량은 숫자여야 합니다.' })
  @Min(0, { message: '단백질 함량은 0 이상이어야 합니다.' })
  proteinPer100g: number;

  @Column('float')
  @IsNumber({}, { message: '탄수화물 함량은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 함량은 0 이상이어야 합니다.' })
  carbsPer100g: number;

  @Column('float')
  @IsNumber({}, { message: '지방 함량은 숫자여야 합니다.' })
  @Min(0, { message: '지방 함량은 0 이상이어야 합니다.' })
  fatPer100g: number;

  // 추가 영양 정보
  @Column('simple-json')
  @IsOptional()
  vitamins?: { [vitamin: string]: number };

  @Column('simple-json')
  @IsOptional()
  minerals?: { [mineral: string]: number };

  // 알레르기 및 식이 제한 정보
  @Column('simple-array')
  @IsOptional()
  @IsArray({ message: '알레르기 유발 성분은 배열이어야 합니다.' })
  allergens?: string[];

  @Column('simple-array')
  @IsOptional()
  @IsArray({ message: '식이 제한은 배열이어야 합니다.' })
  dietaryRestrictions?: string[];

  // 기타 정보
  @Column('int')
  @IsNumber({}, { message: '일반적인 서빙 크기는 숫자여야 합니다.' })
  @Min(0, { message: '서빙 크기는 0 이상이어야 합니다.' })
  typicalServingSize: number; // 단위: 그램

  @Column({ nullable: true })
  @IsOptional()
  seasonality?: string;

  @Column({ nullable: true })
  @IsOptional()
  origin?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 특정 양에 대한 영양 정보 계산 메서드
  calculateNutritionForAmount(amount: number): { [key: string]: number } {
    const factor = amount / 100;
    return {
      calories: this.caloriesPer100g * factor,
      protein: this.proteinPer100g * factor,
      carbs: this.carbsPer100g * factor,
      fat: this.fatPer100g * factor,
      ...this.vitamins && Object.fromEntries(Object.entries(this.vitamins).map(([k, v]) => [k, v * factor])),
      ...this.minerals && Object.fromEntries(Object.entries(this.minerals).map(([k, v]) => [k, v * factor]))
    };
  }

  // 음식 정보 요약 생성 메서드
  generateSummary(): string {
    let summary = `음식 정보: ${this.name}\n`;
    summary += `분류: ${this.category}\n`;
    summary += `칼로리 (100g당): ${this.caloriesPer100g} kcal\n`;
    summary += `단백질 (100g당): ${this.proteinPer100g}g\n`;
    summary += `탄수화물 (100g당): ${this.carbsPer100g}g\n`;
    summary += `지방 (100g당): ${this.fatPer100g}g\n`;
    
    // ... (비타민, 미네랄, 알레르기 유발 성분, 식이 제한 등의 정보 추가)
    
    return summary;
  }
}