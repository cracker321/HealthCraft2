// SupplementRecommendation 엔티티:


// 사용자별 맞춤 영양제 추천 정보 저장
// 추천 영양제 이름, 용량, 복용 시기 등 포함
// 예상 효과 및 주의사항 정보 저장
// 연관 관계:

// User와 N:1 관계 (여러 추천이 한 사용자에 속함)
// NutrientInfo와 M:N 관계 (하나의 추천은 여러 영양소와 관련될 수 있음)

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { User } from './user.entity';
import { NutrientInfo } from './nutrient-info.entity';

@Entity()
export class SupplementRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.supplementRecommendations)
  user: User;

  // 영양제 기본 정보
  @Column()
  @IsNotEmpty({ message: '영양제 이름은 필수입니다.' })
  supplementName: string;

  @Column('float')
  @IsNumber({}, { message: '권장 복용량은 숫자여야 합니다.' })
  @Min(0, { message: '권장 복용량은 0보다 커야 합니다.' })
  recommendedDosage: number;

  @Column()
  @IsNotEmpty({ message: '복용량 단위는 필수입니다.' })
  dosageUnit: string;

  // 복용 스케줄
  @Column('simple-json')
  @IsNotEmpty({ message: '복용 시기는 필수입니다.' })
  intakeSchedule: { [key: string]: boolean }; // 예: {"morning": true, "afternoon": false, "evening": true}

  // 영양제 효과 및 주의사항
  @Column('text')
  @IsNotEmpty({ message: '예상 효과는 필수입니다.' })
  expectedBenefits: string;

  @Column('text', { nullable: true })
  @IsOptional()
  possibleSideEffects?: string;

  @Column('text', { nullable: true })
  @IsOptional()
  precautions?: string;

  // 관련 영양소와의 다대다 관계
  @ManyToMany(() => NutrientInfo)
  @JoinTable()
  relatedNutrients: NutrientInfo[];

  // 약물 및 식품 상호작용 정보
  @Column('simple-json', { nullable: true })
  @IsOptional()
  interactionsWithMedications?: { [medication: string]: string };

  @Column('simple-json', { nullable: true })
  @IsOptional()
  interactionsWithFood?: { [food: string]: string };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 영양제 복용 일정 생성 메서드
  generateIntakeSchedule(frequency: number): void {
    const schedule = {};
    const periods = ['morning', 'afternoon', 'evening'];
    let count = 0;
    for (let i = 0; i < periods.length && count < frequency; i++) {
      schedule[periods[i]] = true;
      count++;
    }
    this.intakeSchedule = schedule;
  }

  // 영양제 상호작용 체크 메서드
  checkInteractions(medications: string[], foods: string[]): string[] {
    const interactions = [];
    medications.forEach(med => {
      if (this.interactionsWithMedications?.[med]) {
        interactions.push(`약물 상호작용: ${med} - ${this.interactionsWithMedications[med]}`);
      }
    });
    foods.forEach(food => {
      if (this.interactionsWithFood?.[food]) {
        interactions.push(`음식 상호작용: ${food} - ${this.interactionsWithFood[food]}`);
      }
    });
    return interactions;
  }

  // 영양제 추천 이유 생성 메서드
  generateRecommendationReason(): string {
    let reason = `${this.supplementName} 추천 이유:\n`;
    reason += `1. 예상 효과: ${this.expectedBenefits}\n`;
    if (this.relatedNutrients.length > 0) {
      reason += `2. 관련 영양소:\n`;
      this.relatedNutrients.forEach(nutrient => {
        reason += `   - ${nutrient.name}: ${nutrient.benefits}\n`;
      });
    }
    return reason;
  }
}