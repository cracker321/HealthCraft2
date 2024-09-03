// ExerciseRecord 엔티티:


// 사용자의 운동 활동 기록 저장
// 운동 종류, 시간, 강도, 소모 칼로리 등 포함
// 건강 목표 달성 추적 및 운동 패턴 분석에 활용
// 연관 관계:

// User와 N:1 관계 (여러 운동 기록이 한 사용자에 속함)


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsDate, IsEnum } from 'class-validator';
import { User } from './user.entity';

@Entity()
export class ExerciseRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 사용자와의 다대일 관계
  @ManyToOne(() => User, user => user.exerciseRecords)
  user: User;

  // 운동 정보
  @Column()
  @IsNotEmpty({ message: '운동 종류는 필수입니다.' })
  exerciseType: string;

  @Column('int')
  @IsNumber({}, { message: '운동 시간은 숫자여야 합니다.' })
  @Min(1, { message: '운동 시간은 1분 이상이어야 합니다.' })
  duration: number; // 단위: 분

  @Column('float')
  @IsNumber({}, { message: '소모 칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '소모 칼로리는 0 이상이어야 합니다.' })
  caloriesBurned: number;

  @Column()
  @IsEnum(['low', 'moderate', 'high'], { message: '유효한 운동 강도를 선택해주세요.' })
  intensity: string;

  @Column()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  exerciseDate: Date;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('simple-json', { nullable: true })
  metrics?: { [key: string]: number }; // 예: {"distance": 5000, "avgHeartRate": 140}

  @CreateDateColumn()
  createdAt: Date;

  // 특정 운동의 MET(Metabolic Equivalent of Task) 값
  private static METValues = {
    'walking': 3.5,
    'running': 8,
    'cycling': 7.5,
    'swimming': 6,
    // 다른 운동들의 MET 값을 추가할 수 있습니다.
  };

  // 칼로리 소모량 계산 메서드
  calculateCaloriesBurned(weight: number): number {
    const MET = ExerciseRecord.METValues[this.exerciseType] || 4; // 기본값 4
    const durationHours = this.duration / 60;
    return MET * weight * durationHours;
  }

  // 운동 강도 결정 메서드
  determineIntensity(maxHeartRate: number): void {
    const avgHeartRate = this.metrics?.avgHeartRate;
    if (!avgHeartRate) return;

    const percentMaxHR = (avgHeartRate / maxHeartRate) * 100;
    if (percentMaxHR < 64) this.intensity = 'low';
    else if (percentMaxHR < 76) this.intensity = 'moderate';
    else this.intensity = 'high';
  }
}