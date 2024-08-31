import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// - TypeORM 라이브러리에서 필요한 기능들을 가져옴.
// - TypeORM
//   : TypeScript 와 JavaScript 를 위한 ORM(Object-Relational Mapping) 라이브러리로,
//     DB 작업을 객체지향적으로 할 수 있게 해줌.
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
//     이 집이 마지막으로 언제 손질되었는지를 알 수 있음.

import { Exclude } from 'class-transformer';
// - class-transformer
//   : 클래스 인스턴스 객체를 다른 형태(e.g: JSON 등)로 변환할 때,
//     특정 속성을 포함하거나 제외할 수 있게 해주는 라이브러리
// - Exclude
//   : Exclude 는 '라이브러리 class-transformer' 에서 제공되는 기능으로, 클래스의 특정 속성을 직렬화 Serialization 과정에서
//     제외할 수 있도록 해줌.
//     직렬화는 객체를 JSON 과 같은 형식으로 변환하는 과정임.
//     즉, Exclude 데코레이터는 특정 속성이 JSON 과 같은 형식으로 변환 직렬화될 때 제외되도록 설정함.
//     예를 들어, 비밀번호와 같은 민감한 정보를 API 응답에서 제외하고 싶을 때 유용함.
//     비유하자면, 중요한 문서를 복사할 때, 개인 정보와 같은 민감한 부분을 가려서 복사하는 것과 같음.
//     복사된 문서에는 개인정보가 노출되지 않도록 보호하는 것이 'Exxclude 데코레이터'의 역할임.
//     즉, 'User 클래스'에서 'password 필드'에 '@Exclude 데코레이터'를 붙이면,
//     이 'password 필드'는 JSON 으로 변환될 때 제외됨.
//     즉, 클라이언트로 전송되는 데이터에는 비밀번호가 포함되지 않음.

import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsDate } from 'class-validator';
// - class-validator
//   : 클래스의 속성에 '유효성 검사'를 적용할 수 있는 라이브러리
// - IsEmail
//   : 이 데코레이터는 'email 필드'가 유효한 이메일 형식인지 확인함.
//     이메일 형식은 반드시 'example@domain.com' 형식이야 함.
//     즉, 이메일 주소에 반드시 '@' 와 '.'이 포함되어야 함.
// - IsNotEmpty
//   : 이 데코레이터는 이 데코레이터가 붙어 있는 필드가 비어 있지 않은지 검사함.
//     즉, 사용자가 반드시 필수적으로 입력하여야 하는 필드(정보)에 사용됨.
//     만약, 사용자가 이 데코레이터가 붙어 있는 필드에 아무것도 입력하지 않으면 에러가 발생함.
//     예를 들어, 'User 클래스'에서 'username 필드'에 '@IsNotEmpty'를 사용하면,
//     사용자가 이 필드에 어떤 정보도 입력하지 않는다면, 오류가 발생함.
// - MinLength
//   : 이 데코레이터는 문자열의 최소 길이를 설정함. 예를 들어, 비밀번호는 최소 8자 이상이어야 한다는 조건 등
// - IsOptional
//   : 이 데코레이터가 붙어 있는 필드는 '선택적'임을 명시함.
//     즉, 이 필드에 사용자가 데이터를 입력하지 않아도 오류가 발생되지 않음.
// - IsDate
//   : 이 데코레이터가 붙어 있는 필드는 반드시 유효한 날짜 형식이어야 함.
//     날짜를 저장하는 필드에 사용됨.
//     예를 들어, 'User 클래스'에서 'resetPasswordExpries 필드'에 '@IsDate'를 붙이면,
//     이 필드가 유효한 날짜 형식이 아닌 경우 오류가 발생함.
//     예를 들어, '2024-08-31'과 같은 형식이어야 함.


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
  @IsEmail()
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



  // < 비밀번호 초기화 토큰 및 만료 시간 열 생성 >
  
  // - 'resetPasswordToken 속성'
  //   : 사용자가 비밀번호를 재설정하려고 할 때, 이 필드에 임시 토큰을 저장함.
  //     이 토큰은 이메일로 사용자에게 전송되어, 비밀번호를 재설정하는 데 사용됨.
  //     즉, 비밀번호 재설정을 위한 고유한 토큰을 저장하는 데 사용되는 속성임.
  //     이는 사용자가 요청할 때만 생성됨.
  // - 'nullable true'
  //   : 이 설정은 필드가 null 값을 가질 수 있음을 의미함. 
  //     즉, 사용자가 비밀번호 재설정을 요청하지 않았다면 이 필드는 비어 있을 수 있음.
  @Column({ nullable: true })
  resetPasswordToken: string;


  // < 비밀번호 초기화 만료 시간 컬럼 >

  // - 'resetPasswordToken 속성'
  //   : 이 속성은 'resetPasswordToken'이 언제까지 유효한지를 저장하는 필드임. 
  //     즉, '임시 번호의 만료 시간'을 저장함.
  //     보안상의 이유로, 토큰은 제한된 시간 동안만 유효하도록 설정됨.
  //     즉, resetPaswordToken 토큰의 유효 기간을 관리하는 속성임.
  //     유효기간이 지나면 사용자는 이 토큰을 사용할 수 없으면, 새로운 토큰을 요청해야 함.
  //     비유하자면, 마치 학생이 받은 임시 비밀번호가 일정 시간이 지나면 만료되는 것과 같음.
  //     이 시간이 지나면 더 이상 사용할 수 없음.
  // - 테이블로 표현
  //   id	resetPasswordExpires
  //    1	2024-09-01T12:00:00Z
  //    2	null

  @Column({ nullable: true })
  resetPasswordExpires: Date;


  // - @CreateDateColumn() 데코레이터
  //   : CreatedAt 이라는 열 column 을 생성하여, 이 DB 행 row 가 처음 생성된 날짜와 시간을 자동으로 기록함.
  //     즉, '해당 User 객체'가 DB 에 처음 삽입되었을 때, 그 시점의 날짜와 시간이 createdAt 컬럼에 기록됨.
  //     만약, DB 에 새로운 'User 레코드'를 추가하면, 그 순간의 시간(예: 2024년 8월 28일 10:00:00)을 createdAt 열에 자동으로 저장됨!!
  // - 'Date'
  //   : 'createdAt 속성' 이 'Date 타입'인 것을 정의해줌.
  // - 테이블로 표현
  // id	    createdAt
  // 1	    2024-08-28T10:00:00Z
  // 2	    2024-08-28T11:00:00Z
  @CreateDateColumn()
  createdAt: Date;



  // - @UpdateDateColumn() 데코레이터
  //   : updateAt 이라는 컬럼 열을 생성하며, 이 레코드가 마지막으로 수정된 시점을 자동으로 기록함.
  //     즉, 현재 이 '해당 User 객체'의 정보가 마지막으로 업데이트된 날짜와 시간을 저장하는 역할임.
  @UpdateDateColumn()
  updatedAt: Date;
}