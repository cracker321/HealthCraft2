import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// - TypeORM 라이브러리에서 필요한 기능들을 가져옴.
// - Entity
//   : 이 데코레이터는 클래스가 DB 테이블로 매핑되도록 지정함.
// - PrimaryGeneratedColumn
//   : DB 테이블에 고유한 ID 를 자동으로 생성하는 열 column 을 만듦.
// - CreateDateColumn
//   : 이 데코레이터는 DB 행 row 가 생성된 날짜와 시간을 기록하는 열 column 을 만듦.
//     비유하자면, 집을 지은 날짜를 기록하는 것과 같음. 이 집이 언제 완성되었는지를 알 수 있음.
// - UpdateDateColumn
//   : 이 데코레이터는 DB 행 row 가 마지막으로 업데이트된 날짜와 시간을 기록하는 열 column 을 만듦.
//     비유하자면, 집을 마지막으로 리모델링한 날짜를 기록하는 것과 같음. 
//     이 집이 맞미ㅏㄱ으로 언제 손질되었는지를 알 수 있음.

import { Exclude } from 'class-transformer';
// - Exclude
//   : Exclude 는 '라이브러리 class-transformer' 에서 제공되는 기능으로, 클래스의 특정 속성을 직렬화 Serialization 과정에서 
//     제외할 수 있도록 해줌.
//     직렬화는 객체를 JSON 과 같은 형식으로 변환하는 과정임.
//     즉, Exclude 데코레이터는 특정 속성이 JSON 과 같은 형식으로 변환 직렬화될 때 제외되도록 설정함.
//     예를 들어, 비밀번호와 같은 민감한 정보를 API 응답에서 제외하고 싶을 때 유용함.
//     비유하자면, 중요한 문서를 복사할 때, 개인 정보와 같은 민감한 부분을 가려서 복사하는 것과 같음. 
//     복사된 문서에는 개인정보가 노출되지 않도록 보호하는 것이 'Exxclude 데코레이터'의 역할임



@Entity()
export class User { // '클래스 User' 를 정의함.


  // - '@PrimaryGeneratedColumn() 데코레이터'
  //   : 이 데코레이터는 id 라는 고유한 기본 키 PK 열 column 을 생성함. 
  //     이 column 은 UUID 형식으로 자동 생성된 고유한 값을 가짐.
  // - '범용 고유 식별자 Universally Unique Identifier(UUID)'형식의 고유한 값을 가지는
  //   id 라는 속성이 기본 키(Primary Key) 임을 정의함.
  // - UUID 는 128비트 숫자로, 전 세계에서 고유한 식별자를 만들 수 있음.
  //   매우 길기 때문에 다른 UUID 와 겹칠 가능성이 거의 없다!
  //   e.g) f0e5a9e8-4d45-4d0b-bd4d-5a57c5df5b5d
  @PrimaryGeneratedColumn('uuid')
  id: string;


  // - '@Column 데코레이터'
  //   : 이 데코레이터는 'email 속성'을 DB의 열 column 으로 정의하며,
  //     이 column 의 값이 고유해야 함을 의미함. 
  //     즉, 두 사용자가 동일한 이메일을 가질 수 없음.
  // - 'unique: true'
  //   : 이 설정은 이메일 주소가 DB 내에서 중복되지 않도록 보장함.
  //     즉, 동일한 이메일을 가진 두 개의 레코드가 존재할 수 없는 것임!!
  @Column({ unique: true })
  email: string;

  @Column()
  username: string;


  // - '@Exclude 데코레이터'
  //   : 사용자의 비밀번호 password 속성은 JSON 으로 변환될 때 API 응답에서 제외된다!
  //     즉, @Exclude 데코레이터는 사용자의 비밀번호가 외부로 노출되지 않도록 보호함.
  //     사용자의 비밀번호는 사용자가 로그인할 때만 사용되며, API 응답으로 제공될 필요가 없음.
  //     비유하자면, 이 코드는 마치 은행에서 사용하는 비밀번호와 같음. 고객이 돈을 인출하려면 비밀번호가 필요하지만, 
  //     이 비밀번호는 외부에 절대 노출되지 않아야 함. @Exclude()는 이 비밀번호를 안전하게 보호하는 역할을 함.
  @Column()
  @Exclude()
  password: string;

  
  // < 비밀번호 재성정 토큰 및 만료 시간 열 생성 >
  // - 'resetPasswordToken 속성'
  //   : 사용자가 비밀번
  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}