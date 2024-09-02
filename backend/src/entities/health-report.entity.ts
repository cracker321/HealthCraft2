// HealthReport 엔티티:


// 사용자의 종합 건강 상태 보고서 저장
// 전반적 건강 상태, 개선점, 권장 사항 등 포함
// 다른 엔티티들의 데이터를 종합하여 생성
// 연관 관계:

// User와 N:1 관계 (여러 보고서가 한 사용자에 속함)
// HealthCheckup, NutritionPlan, ExerciseRecord 등과 관련됨

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsDate } from 'class-validator';
import { User } from './user.entity';
import { HealthCheckup } from './health-checkup.entity';

@Entity()
export class HealthReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.healthReports)
  user: User;

  @OneToOne(() => HealthCheckup)
  @JoinColumn()
  latestCheckup: HealthCheckup;

  @Column()
  @IsNotEmpty({ message: '보고서 생성 날짜는 필수입니다.' })
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  reportDate: Date;

  @Column('text')
  @IsNotEmpty({ message: '전반적인 건강 상태 평가는 필수입니다.' })
  overallHealthStatus: string;

  @Column('simple-json')
  healthMetrics: {
    bmi: number;
    bloodPressureStatus: string;
    cholesterolStatus: string;
    bloodSugarStatus: string;
  };

  @Column('simple-array')
  improvements: string[];

  @Column('simple-array')
  risks: string[];

  @Column('simple-json')
  recommendations: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
  };

  @Column('text', { nullable: true })
  additionalNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  // 건강 보고서 요약 생성 메서드
  generateSummary(): string {
    let summary = `건강 보고서 요약 (${this.reportDate.toLocaleDateString()})\n\n`;
    summary += `전반적인 건강 상태: ${this.overallHealthStatus}\n\n`;
    summary += '주요 건강 지표:\n';
    summary += `- BMI: ${this.healthMetrics.bmi}\n`;
    summary += `- 혈압: ${this.healthMetrics.bloodPressureStatus}\n`;
    summary += `- 콜레스테롤: ${this.healthMetrics.cholesterolStatus}\n`;
    summary += `- 혈당: ${this.healthMetrics.bloodSugarStatus}\n\n`;
    summary += '개선 사항:\n' + this.improvements.map(imp => `- ${imp}`).join('\n') + '\n\n';
    summary += '건강 위험 요소:\n' + this.risks.map(risk => `- ${risk}`).join('\n') + '\n\n';
    summary += '권장 사항:\n';
    summary += '식단: ' + this.recommendations.diet.map(rec => `- ${rec}`).join('\n') + '\n';
    summary += '운동: ' + this.recommendations.exercise.map(rec => `- ${rec}`).join('\n') + '\n';
    summary += '생활 습관: ' + this.recommendations.lifestyle.map(rec => `- ${rec}`).join('\n');
    return summary;
  }

  // 이전 보고서와 비교하는 메서드
  compareWithPrevious(previous: HealthReport): { [key: string]: string } {
    const comparison = {};
    comparison.overallHealthStatus = this.overallHealthStatus === previous.overallHealthStatus
      ? '변화 없음'
      : `${previous.overallHealthStatus} -> ${this.overallHealthStatus}`;
    comparison.bmiChange = (this.healthMetrics.bmi - previous.healthMetrics.bmi).toFixed(2);
    comparison.newImprovements = this.improvements.filter(imp => !previous.improvements.includes(imp));
    comparison.newRisks = this.risks.filter(risk => !previous.risks.includes(risk));
    return comparison;
  }
}

