import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// - TypeORM 라이브러리에서 필요한 기능들을 가져옴.
// - Entity
//   : 이 데코레이터는 클래스가 DB 테이블로 매핑되도록 지정함.
// - PrimaryGeneratedColumn
//   : DB 테이블에 고유한 ID 를 자동으로 생성하는 열 column 을 만듦.
// - CreateDateColumn
//   : 이 데코레이터는 DB 행 row 가 생성된 날짜와 시간을 기록하는 열 column 을 만듦
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}