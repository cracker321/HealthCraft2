// Allergy 엔티티:


// 사용자의 알레르기 정보 저장
// 알레르기 유발 물질, 반응 정도, 진단일 등 포함
// 식단 계획 및 음식 추천 시 고려됨
// 연관 관계:

// User와 N:1 관계 (여러 알레르기가 한 사용자에 속함)

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsEnum, IsDate, IsOptional } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.allergies)
  user: User;

  @Column()
  @IsNotEmpty({ message: '알레르기 유발 물질은 필수입니다.' })
  allergen: string;

  @Column()
  @IsNotEmpty({ message: '반응 정도는 필수입니다.' })
  @IsEnum(['mild', 'moderate', 'severe'], { message: '유효한 반응 정도를 선택해주세요.' })
  severity: string;

  @Column()
  @IsNotEmpty({ message: '진단일은 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  diagnosisDate: Date;

  @Column('simple-array')
  @IsNotEmpty({ message: '증상은 최소 하나 이상 입력해야 합니다.' })
  symptoms: string[];

  @Column('text', { nullable: true })
  @IsOptional()
  treatmentPlan?: string;

  @Column('simple-array', { nullable: true })
  @IsOptional()
  emergencyMedications?: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 알레르기 정보 요약 생성 메서드
  generateSummary(): string {
    let summary = `알레르기: ${this.allergen}\n`;
    summary += `심각도: ${this.severity}\n`;
    summary += `진단일: ${this.diagnosisDate.toLocaleDateString()}\n`;
    summary += `증상: ${this.symptoms.join(', ')}\n`;
    if (this.treatmentPlan) {
      summary += `치료 계획: ${this.treatmentPlan}\n`;
    }
    if (this.emergencyMedications && this.emergencyMedications.length > 0) {
      summary += `응급 약물: ${this.emergencyMedications.join(', ')}\n`;
    }
    summary += `현재 상태: ${this.isActive ? '활성' : '비활성'}\n`;
    return summary;
  }

  // 응급 대응 정보 생성 메서드
  generateEmergencyInfo(): string {
    let info = `!! 알레르기 주의 !!\n`;
    info += `알레르겐: ${this.allergen}\n`;
    info += `심각도: ${this.severity}\n`;
    info += `증상: ${this.symptoms.join(', ')}\n`;
    if (this.emergencyMedications && this.emergencyMedications.length > 0) {
      info += `응급 약물: ${this.emergencyMedications.join(', ')}\n`;
    }
    return info;
  }
}