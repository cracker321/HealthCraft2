// DietaryRestriction 엔티티:


// 사용자의 식이 제한 사항 저장
// 제한 유형, 이유, 시작일 등 포함
// 식단 계획 및 음식 추천 시 고려됨
// 연관 관계:

// User와 N:1 관계 (여러 제한 사항이 한 사용자에 속함)



import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsEnum, IsDate, IsOptional } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class DietaryRestriction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // User 와의 다대일 관계
  @ManyToOne(() => User, user => user.dietaryRestrictions)
  user: User;

  // 식이 제한 정보
  @Column()
  @IsNotEmpty({ message: '제한 유형은 필수입니다.' })
  @IsEnum(['vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'nut-free', 'low-carb', 'low-fat', 'low-sodium', 'other'], 
    { message: '유효한 제한 유형을 선택해주세요.' })
  restrictionType: string;

  @Column('text')
  @IsNotEmpty({ message: '제한 이유는 필수입니다.' })
  reason: string;

  @Column()
  @IsNotEmpty({ message: '시작일은 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  startDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  endDate?: Date;

  @Column('simple-array', { nullable: true })
  @IsOptional()
  excludedFoods?: string[];

  @Column('simple-array', { nullable: true })
  @IsOptional()
  alternativeFoods?: string[];

  @Column('text', { nullable: true })
  @IsOptional()
  additionalNotes?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 현재 활성 상태 확인 메서드 (이름 변경됨)
  checkIfActive(): boolean {
    return !this.endDate || this.endDate > new Date();
  }

  // 제한 기간 계산 메서드
  getDurationInDays(): number {
    const end = this.endDate || new Date();
    const diffTime = Math.abs(end.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 식단 제한 요약 생성 메서드
  generateSummary(): string {
    let summary = `식단 제한: ${this.restrictionType}\n`;
    summary += `이유: ${this.reason}\n`;
    summary += `시작일: ${this.startDate.toLocaleDateString()}\n`;
    if (this.endDate) {
      summary += `종료일: ${this.endDate.toLocaleDateString()}\n`;
    }
    if (this.excludedFoods && this.excludedFoods.length > 0) {
      summary += `제외 식품: ${this.excludedFoods.join(', ')}\n`;
    }
    if (this.alternativeFoods && this.alternativeFoods.length > 0) {
      summary += `대체 식품: ${this.alternativeFoods.join(', ')}\n`;
    }
    summary += `현재 상태: ${this.checkIfActive() ? '활성' : '비활성'}\n`;
    return summary;
  }
}



