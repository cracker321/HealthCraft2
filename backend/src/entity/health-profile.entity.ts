// HealthProfile 엔티티:


// 사용자의 현재 건강 상태를 상세히 기록
// 기본 신체 측정치(키, 체중 등) 저장
// 계산된 건강 지표(BMI, BMR, 체지방률 등) 포함
// 사용자의 활동 수준 및 건강 목표 정보 저장
// 시간에 따른 건강 상태 변화 추적 가능
// 개인화된 영양 및 운동 계획 수립의 기초 데이터로 활용
// 정기적인 업데이트 및 변화 이력 관리 필요
// 연관 관계:

// User와 N:1 관계 (여러 건강 프로필이 한 사용자에 속함)
// NutritionPlan 생성 시 참조됨


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { User } from './user.entity';
import { NutritionPlan } from './nutrition-plan.entity';

@Entity()
export class HealthProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.healthProfiles)
  user: User;

  // 키와 체중 정보. 유효성 검사 포함
  @Column('float')
  @IsNotEmpty({ message: '키는 필수 입력 항목입니다.' })
  @IsNumber({}, { message: '키는 숫자여야 합니다.' })
  @Min(0, { message: '키는 0보다 커야 합니다.' })
  @Max(300, { message: '키는 300cm를 초과할 수 없습니다.' })
  height: number;

  @Column('float')
  @IsNotEmpty({ message: '체중은 필수 입력 항목입니다.' })
  @IsNumber({}, { message: '체중은 숫자여야 합니다.' })
  @Min(0, { message: '체중은 0보다 커야 합니다.' })
  @Max(500, { message: '체중은 500kg을 초과할 수 없습니다.' })
  weight: number;

  // BMI와 BMR 정보
  @Column('float')
  bmi: number;

  @Column('float')
  bmr: number;

  // 체지방률과 근육량 정보 (선택적)
  @Column('float', { nullable: true })
  @IsNumber({}, { message: '체지방률은 숫자여야 합니다.' })
  @Min(0, { message: '체지방률은 0% 이상이어야 합니다.' })
  @Max(100, { message: '체지방률은 100%를 초과할 수 없습니다.' })
  bodyFatPercentage?: number;

  @Column('float', { nullable: true })
  @IsNumber({}, { message: '근육량은 숫자여야 합니다.' })
  @Min(0, { message: '근육량은 0kg 이상이어야 합니다.' })
  muscleMass?: number;

  // 활동 수준과 건강 목표
  @Column()
  @IsEnum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'], 
    { message: '유효한 활동 수준을 선택해주세요.' })
  activityLevel: string;

  @Column()
  @IsEnum(['weight_loss', 'muscle_gain', 'maintenance', 'general_health'], 
    { message: '유효한 건강 목표를 선택해주세요.' })
  healthGoal: string;

  // 영양 계획과의 일대다 관계
  @OneToMany(() => NutritionPlan, nutritionPlan => nutritionPlan.healthProfile)
  nutritionPlans: NutritionPlan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // BMI 계산 메서드
  calculateBMI() {
    this.bmi = this.weight / ((this.height / 100) ** 2);
  }

  // BMR 계산 메서드 (해리스-베네딕트 공식 사용)
  calculateBMR(age: number, gender: string) {
    if (gender === 'male') {
      this.bmr = 88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * age);
    } else {
      this.bmr = 447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * age);
    }
  }

  // 일일 칼로리 요구량 계산 메서드
  calculateDailyCalorieNeeds(): number {
    let activityFactor;
    switch (this.activityLevel) {
      case 'sedentary': activityFactor = 1.2; break;
      case 'lightly_active': activityFactor = 1.375; break;
      case 'moderately_active': activityFactor = 1.55; break;
      case 'very_active': activityFactor = 1.725; break;
      case 'extra_active': activityFactor = 1.9; break;
      default: activityFactor = 1.2;
    }
    return this.bmr * activityFactor;
  }
}