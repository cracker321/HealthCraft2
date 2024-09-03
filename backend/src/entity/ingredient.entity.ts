// Ingredient 엔티티:


// 개별 식재료에 대한 정보 저장
// 식재료 이름, 기본 단위, 영양 정보 포함
// 레시피 구성 및 영양 계산에 활용
// 연관 관계:

// Recipe와 M:N 관계
// FoodDatabase와 1:1 또는 1:N 관계 (식재료 정보가 음식 데이터베이스의 일부가 될 수 있음)


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: '재료 이름은 필수입니다.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: '기본 계량 단위는 필수입니다.' })
  baseUnit: string;

  @Column('float')
  @IsNumber({}, { message: '칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  calories: number; // 100g 당 칼로리

  @Column('float')
  @IsNumber({}, { message: '단백질은 숫자여야 합니다.' })
  @Min(0, { message: '단백질은 0 이상이어야 합니다.' })
  protein: number; // 100g 당 단백질 (g)

  @Column('float')
  @IsNumber({}, { message: '탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물은 0 이상이어야 합니다.' })
  carbs: number; // 100g 당 탄수화물 (g)

  @Column('float')
  @IsNumber({}, { message: '지방은 숫자여야 합니다.' })
  @Min(0, { message: '지방은 0 이상이어야 합니다.' })
  fat: number; // 100g 당 지방 (g)

  @Column('float', { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '식이섬유는 숫자여야 합니다.' })
  @Min(0, { message: '식이섬유는 0 이상이어야 합니다.' })
  fiber?: number; // 100g 당 식이섬유 (g)

  @Column('float', { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '당류는 숫자여야 합니다.' })
  @Min(0, { message: '당류는 0 이상이어야 합니다.' })
  sugar?: number; // 100g 당 당류 (g)

  @Column('simple-array', { nullable: true })
  allergens?: string[]; // 알레르기 유발 성분 목록

  @Column('simple-array', { nullable: true })
  dietaryRestrictions?: string[]; // 식이 제한 정보 (예: 채식, 글루텐 프리 등)

  @Column({ nullable: true })
  seasonality?: string; // 제철 정보

  @Column({ nullable: true })
  origin?: string; // 원산지 정보

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 특정 양에 대한 영양 정보 계산 메서드
  calculateNutritionForAmount(amount: number, unit: string): {calories: number, protein: number, carbs: number, fat: number} {
    const factor = this.convertToBaseUnit(amount, unit) / 100;
    return {
      calories: this.calories * factor,
      protein: this.protein * factor,
      carbs: this.carbs * factor,
      fat: this.fat * factor
    };
  }

  // 단위 변환 메서드 (예시, 실제로는 더 복잡할 수 있음)
  private convertToBaseUnit(amount: number, unit: string): number {
    switch(unit) {
      case 'g':
        return amount;
      case 'kg':
        return amount * 1000;
      case 'oz':
        return amount * 28.35;
      // 다른 단위들에 대한 변환 로직 추가
      default:
        return amount;
    }
  }
}