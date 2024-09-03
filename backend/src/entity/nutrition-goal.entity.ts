import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsDate, IsEnum, IsOptional } from 'class-validator';
import { User } from './user.entity';

// NutritionGoal 엔티티:
// 사용자의 영양 목표를 저장하고 관리하는 엔티티
// 목표 유형, 칼로리 및 영양소 목표, 시작일 및 종료일 등을 포함
@Entity()
export class NutritionGoal {
  // 'uuid'를 문자열로 변경
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.nutritionGoals)
  user: User;

  @Column()
  @IsNotEmpty({ message: '목표 설정 날짜는 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  startDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  endDate?: Date;

  @Column()
  @IsNotEmpty({ message: '목표 유형은 필수입니다.' })
  @IsEnum(['weight_loss', 'muscle_gain', 'maintenance', 'health_improvement'], 
    { message: '유효한 목표 유형을 선택해주세요.' })
  goalType: string;

  @Column('int')
  @IsNumber({}, { message: '일일 목표 칼로리는 숫자여야 합니다.' })
  @Min(1000, { message: '일일 목표 칼로리는 최소 1000kcal 이상이어야 합니다.' })
  @Max(5000, { message: '일일 목표 칼로리는 최대 5000kcal 이하여야 합니다.' })
  dailyCalorieTarget: number;

  @Column('float')
  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0g 이상이어야 합니다.' })
  proteinTarget: number;

  @Column('float')
  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0g 이상이어야 합니다.' })
  carbTarget: number;

  @Column('float')
  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0g 이상이어야 합니다.' })
  fatTarget: number;

  @Column('simple-json', { nullable: true })
  @IsOptional()
  additionalNutrients?: { [nutrient: string]: number };

  @Column('text', { nullable: true })
  @IsOptional()
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 목표 달성 진행률 계산 메서드
  // 현재 섭취량을 입력받아 각 영양소별 목표 달성 진행률을 계산
  calculateProgress(currentIntake: { calories: number, protein: number, carbs: number, fat: number }): { [key: string]: number } {
    return {
      caloriesProgress: (currentIntake.calories / this.dailyCalorieTarget) * 100,
      proteinProgress: (currentIntake.protein / this.proteinTarget) * 100,
      carbsProgress: (currentIntake.carbs / this.carbTarget) * 100,
      fatProgress: (currentIntake.fat / this.fatTarget) * 100
    };
  }

  // 영양 목표 요약 생성 메서드
  // 현재 설정된 영양 목표의 상세 내용을 문자열로 반환
  generateSummary(): string {
    let summary = `영양 목표 (${this.startDate.toLocaleDateString()} - ${this.endDate ? this.endDate.toLocaleDateString() : '진행 중'})\n\n`;
    summary += `목표 유형: ${this.goalType}\n`;
    summary += `일일 칼로리 목표: ${this.dailyCalorieTarget} kcal\n`;
    summary += `단백질 목표: ${this.proteinTarget}g\n`;
    summary += `탄수화물 목표: ${this.carbTarget}g\n`;
    summary += `지방 목표: ${this.fatTarget}g\n`;

    if (this.additionalNutrients) {
      summary += '\n추가 영양소 목표:\n';
      for (const [nutrient, target] of Object.entries(this.additionalNutrients)) {
        summary += `- ${nutrient}: ${target}g\n`;
      }
    }

    if (this.notes) {
      summary += `\n비고: ${this.notes}\n`;
    }

    return summary;
  }
}