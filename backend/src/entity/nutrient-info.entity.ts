// NutrientInfo 엔티티:


// 개별 영양소에 대한 상세 정보 저장
// 영양소 이름, 단위, 일일 권장 섭취량 등 포함
// 과다 섭취 시 부작용, 부족 시 증상 정보 저장
// 영양 분석 및 권장 사항 제공에 활용
// 연관 관계:

// 다른 엔티티들(FoodDatabase, Recipe, MealRecord 등)에서 참조됨

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

@Entity()
export class NutrientInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: '영양소 이름은 필수입니다.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: '단위는 필수입니다.' })
  unit: string;

  @Column('float')
  @IsNumber({}, { message: '일일 권장 섭취량은 숫자여야 합니다.' })
  @Min(0, { message: '일일 권장 섭취량은 0 이상이어야 합니다.' })
  dailyRecommendedIntake: number;

  @Column('text', { nullable: true })
  @IsOptional()
  description?: string;

  @Column('text', { nullable: true })
  @IsOptional()
  benefits?: string;

  @Column('text', { nullable: true })
  @IsOptional()
  deficiencySymptoms?: string;

  @Column('text', { nullable: true })
  @IsOptional()
  excessSymptoms?: string;

  @Column('simple-array', { nullable: true })
  foodSources?: string[];

  @Column('float', { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '상한 섭취량은 숫자여야 합니다.' })
  @Min(0, { message: '상한 섭취량은 0 이상이어야 합니다.' })
  upperLimit?: number;

  @Column('simple-json', { nullable: true })
  @IsOptional()
  ageSpecificRecommendations?: { [ageGroup: string]: number };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 특정 섭취량에 대한 권장 섭취량 대비 비율 계산 메서드
  calculateIntakePercentage(intakeAmount: number): number {
    return (intakeAmount / this.dailyRecommendedIntake) * 100;
  }

  // 특정 나이 그룹에 대한 권장 섭취량 반환 메서드
  getRecommendationForAge(ageGroup: string): number | undefined {
    return this.ageSpecificRecommendations?.[ageGroup];
  }

  // 영양소 정보 요약 생성 메서드
  generateSummary(): string {
    let summary = `영양소: ${this.name}\n`;
    summary += `단위: ${this.unit}\n`;
    summary += `일일 권장 섭취량: ${this.dailyRecommendedIntake}\n`;
    if (this.description) {
      summary += `설명: ${this.description}\n`;
    }
    if (this.benefits) {
      summary += `이점: ${this.benefits}\n`;
    }
    if (this.deficiencySymptoms) {
      summary += `결핍 증상: ${this.deficiencySymptoms}\n`;
    }
    if (this.excessSymptoms) {
      summary += `과다 섭취 증상: ${this.excessSymptoms}\n`;
    }
    if (this.foodSources && this.foodSources.length > 0) {
      summary += `식품 원천: ${this.foodSources.join(', ')}\n`;
    }
    if (this.upperLimit) {
      summary += `상한 섭취량: ${this.upperLimit}\n`;
    }
    return summary;
  }
}