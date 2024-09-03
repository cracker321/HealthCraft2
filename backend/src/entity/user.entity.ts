// User 엔티티:

// 시스템의 핵심 엔티티로 모든 사용자 관련 정보 저장
// 기본적인 인증 정보(이메일, 암호화된 비밀번호) 포함
// 개인 프로필 정보(이름, 성별, 생년월일 등) 관리
// 계정 상태 및 활동 추적(생성일, 마지막 로그인 등)
// 개인정보 보호를 위한 중요 데이터 암호화 고려
// 사용자 활동 및 보안 모니터링에 활용
// 연관 관계:

// HealthProfile과 1:N 관계 (한 사용자는 여러 건강 프로필을 가질 수 있음)
// NutritionPlan과 1:N 관계 (한 사용자는 여러 영양 계획을 가질 수 있음)
// MealRecord와 1:N 관계 (한 사용자는 여러 식사 기록을 가질 수 있음)
// ExerciseRecord와 1:N 관계 (한 사용자는 여러 운동 기록을 가질 수 있음)
// Allergy, DietaryRestriction과 각각 1:N 관계

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

import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsDate, IsEnum } from 'class-validator';
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

import { HealthProfile } from './health-profile.entity';
import { NutritionPlan } from './nutrition-plan.entity';
import { MealRecord } from './meal-record.entity';
import { ExerciseRecord } from './exercise-record.entity';
import { WaterIntakeRecord } from './water-intake-record.entity';
import { SleepRecord } from './sleep-record.entity';
import { MoodRecord } from './mood-record.entity';
import { SupplementRecord } from './supplement-record.entity';
import { BloodSugarRecord } from './blood-sugar-record.entity';
import { Allergy } from './allergy.entity';
import { DietaryRestriction } from './dietary-restriction.entity';


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
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @Column()
  @IsNotEmpty({ message: '사용자 이름은 필수 입력 항목입니다.' })
  @MinLength(3, { message: '사용자 이름은 최소 3자 이상이어야 합니다.' }) 
  username: string;


  // - '@Exclude 데코레이터'
  //   : 사용자의 비밀번호 password 속성은 JSON 으로 변환될 때 API 응답에서 제외된다!
  //     즉, @Exclude 데코레이터는 사용자의 비밀번호가 외부로 노출되지 않도록 보호함.
  //     사용자의 비밀번호는 사용자가 로그인할 때만 사용되며, API 응답으로 제공될 필요가 없음.
  //     비유하자면, 이 코드는 마치 은행에서 사용하는 비밀번호와 같음. 고객이 돈을 인출하려면 비밀번호가 필요하지만, 
  //     이 비밀번호는 외부에 절대 노출되지 않아야 함. @Exclude()는 이 비밀번호를 안전하게 보호하는 역할을 함.
  @Column()
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
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
  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
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


  @Column()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  firstName: string;

  @Column()
  @IsNotEmpty({ message: '성은 필수 입력 항목입니다.' })
  lastName: string;

  @Column()
  @IsDate({ message: '유효한 생년월일 형식이 아닙니다.' })
  dateOfBirth: Date;

  @Column()
  @IsEnum(['male', 'female', 'other'], { message: '유효한 성별을 선택해주세요.' })
  gender: string;


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


  // =================================================================================================



  // [ 연관관계 정의 ]


  // - @OneToMany
  //   : TypeORM 의 데코레이터로 'User 엔티티' 와 'HealthProfile 엔티티' 간의 '1 : N 관계'를 정의.
  //     이는 하나의 사용자 User 엔티티' 가 'N 개의 건강 프로필 HealthProfile' 을 가질 수 있음.
  //     '부모(One, 사용자 User)' 는 'N 명의 자녀(Many, 건강 프로필 HealthProfile)'를 가질 수 있음.
  //     이때 각각의 자녀(N 개의 건강 프로필 HeatlhProfile)들은 자신만의 특성을 가지고 있지만,
  //     이는 모두 부모(1 명의 사용자 User)'와 연결되어 있음.
  //     이 구조를 통해, 1 명의 사용자 User 아이디로 그 사용자의 N 개의 모든 건강 프로파일을 쉽게 검색할 수 있음.
  //     비유하자면, 한 사람이 운동 관련 건강 프로필, 식이요법 관련 건강 프로필 등 N 개의 건강 프로필들을 관리할 수 있음.
  //     이처럼 한 사람은 N 개의 건강 프로필들을 가지고 있을 수 있음.
  //     다른 비유하자면, 한 선생님(= 한 명의 User)은 여러 명의 학생(= 여러 개의 건강 프로필 HealthProfile)들을 가르칠 수 있음.
  //     이때, 각 학생(= 개별 건강 프로필 HealthProfile)은 오직 한 명의 선생님(= 한 명의 User)에게만 속함.

  // - () => HealthProfile
  //   : 'HealthProfile 엔티티'를 지칭함. TypeORM 은 이 표현식을 통해 어떤 엔티티와 관계를 맺을지를 파악함.
  //     TypeORM 은 '람다함수를 사용'하여 이 연관관계가 어떤 엔티티와 맺어지는지를 명확하게 이해함.
  //     이 표현식은 나중에 런타임에서 '실제 엔티티 클래스 HealthProfile'을 참조하는 역할을 함.
  //     비유하자면, 이 부분은 'N 명의 자녀(= N 개의 건강 프로필 HealthProfile)들의 종료'를 명시하는 것임.
  //     부모(= 1 명의 사용자 User)가 N 명의 자녀(= N 개의 건강 프로필 HealthProfile)를 가질 수 있다고 할 때,
  //     여기서는 N 명의 자녀(= N 개의 건강 프로필 HealthProfile)가 '건강 프로필 HealthProfile 엔티티'라는 것을 
  //     구체적으로 명시하는 것임.
  //     
  //     ***중요*** 
  //     람다함수는 익명함수로, '( 매개변수 ) => { 실행코드 }' 형태로 정의됨.
  //     여기서는 매개변수 없이 'HealthProfile 엔티티'를 반환하는 함수임.
  //     이 람다함수를 훌어서 작성하자면 아래와 같이 됨.
  //     이것의 의미는 단순히 'HealthProfile 클래스(엔티티)' 를 반환하는 간단한 함수임.
  //
  //     function getHeatlhProfile(){
  //          return HealthProfile;  
  //     }
  //     

  
  //   GPT 제목: '서비스 기획 및 설계' <-- 이게 메인.
  //             또는 'Top VSCode GPT Plugins'
  
  
  //    ***중요***
  //    Q: 왜 이렇게 람다함수를 사용하여 작성하는가?람다 함수
  //    A: - TypeScript 의 타입 정보는 컴파일 시점에만 존재하고, 런타임 시점에서는 사라짐.
  //         이로 인해, TypeORM 은 런타임 시점에 필요한 엔티티 정보를 가져와야 함.
  //       - 람다 함수는 TypeORM 이 런타임 시점에 정확한 엔티티를 가져오도록 도와줌.
  //         이를 통해 TypeORM 은 엔티티 간의 관계를 정확하게 설정할 수 있음.
  //       - 비유하자면, 요리를 하고자 할 때 어떤 재료를 사용할지 미리 정하지 않고,
  //         요리하는 그 시점에서 즉석으로 필요한 재료를 바로 꺼내 사용하는 것과 같음.
  //         즉, 만약 요리사가 어떤 요리를 할지 미리 결정하지 않았다면,
  //         요리를 시작할 때 그 요리에 필요한 재료를 선택해서 사용하는 것임.
  //         람다 함수는 이 재료 선택 과정을 자동화해주는 것임.
  //       - 실제 동작 방식
  //         : 코드가 실행될 때, TypeORM 은 람다 함수를 호출하여 'HealthProfile 엔티티'를 가져옴.
  //           이를 통해 TypeORM 은 런타임에 필요한 정보를 얻어, 엔티티들 간의 관계를 설정할 수 있음.
  //       - 컴파일 시점과의 차이
  //         : TypeScript, TypeORM 은 컴파일 시점에서는 'HealtProfile 클래스'가 어떤 클래스인지 알지 못함.
  //           하지만, 런타임 시점에서는 TypeORM 이 람다 함수를 호출하여
  //           정확한 'HealthProfile 클래스'를 호출하여 그것을 정확히 참조할 수 있게 됨.
  //    
  //    GPT 제목: Detailed Code Explanation
  //    https://chatgpt.com/share/f06bbd27-3182-406a-824c-418c065a65c4
  
  
  
  
  
  // [ 컴파일 시점(Compile-time) 과 런타임 시점(Runtime) ]

  // < 컴파일 시점 >
  
  // - 프로그램을 실행하기 전의 단계로, 코드가 작성된 후에 '이 코드를 기계어로 변환하는 과정'.
  //   순서 1) 코드 작성
  //           : 프로그래머가 소스코드를 작성함. 이는 레시피를 적는 것과 같음.
  //             레시피(코드)가 정확해야 요리(프로그램)가 제대로 만들어질 수 있음.
  //             비유하자면, 레시피에 '닭고기 1kg, 소금 10g, 물 1L'라고 적는 것과 같음.
  //   순서 2) 구문 검사
  //           : 컴파일러는 이 코드를 읽고, 이 코드가 올바른 구문을 따르고 있는지 확임.
  //             잘못된 구문이 있다면 컴파일 시점에서 오류가 발생함.
  //             레시피에 '닭고기 1kg, 소금 10g, 물 1L'라고 적었지만, 
  //             코드에는 '소금 10L'라고 적었다면, 이는 오류가 됨.
  //             비유하자면, 요리를 시작하기 전에 이런 오류를 발견하는 과정임.
  //   순서 3) 타입 검사
  //           : 타입 검사는 코드에서 사용되는 데이터 타입이 올바른지 확인하는 과정임.
  //   순서 4) 코드 최적화
  //           : 코드 최적화는 프로그램이 더 효율적으로 실행될 수 있도록 컴파일러가 코드의 구조를 개선하는 과정임.
  //             비유하자면, 요리할 때 시간을 절약하기 위해 채소를 모두 한 번에 썰고, 냄비를 미리 예열하는 것과 같음.
  //             이러한 최적화 작업은 요리시간을 단축시킴.
  //   순서 5) 목적 코드 생성
  //           : 목적 코드 생성은 컴파일러가 소스 코드를 실제로 실행 가능한 기계어로 변환시키는 단계임.
  //             이 목적 코드는 컴퓨터가 이해할 수 있는 형태로 변환된 것임.
  //             비유하자면, 레시피를 보고 실제로 음식을 요리하는 것과 같음. 이 단계에서 모든 재료가 준비되고, 요리가 완료됨.
  //             ***결과물: 이 모든 과정을 거친 후의 결과물은 '실행 파일' 또는 '바이트 코드'임***
  
  
  
  // < 컴파일 시점 >
  
  // - 프로그램이 실제로 실행되는 단계. 이 시점에서는 프로그램이 사용자의 입력을 받아들이고, 
  //   그에 따라 동작하며, 필요에 따라 오류를 처리함. 
  //   비유하자면, 이 단계는 요리가 완료된 후, 음식을 실제로 먹는 과정임.
  //   순서 1) 메모리 할당 및 해제
  //           : 프로그램이 실행될 때, 필요한 메모리가 할당됨.
  //             이는 프로그램이 작동하기 위해 필요한 데이터를 저장할 공간을 마련하는 과정임.
  //             메모리가 더 이상 필요하지 않으면 해제됨.
  //             비유하자면, 음식을 먹을 때, 접시와 식기를 준비하는 것과 같음. 음식이 끝나면 식기를 치우는 것이 메모리 해제에 해당함.
  //   순서 2) 동적 바인딩
  //           : 동적 바인딩은 프로그램이 실행 중에 어떤 함수나 메소드를 호출할지 결정하는 과정임.
  //             이는 다형성 Polymorphism 개념에서 중요한 역할을 함.
  //             비유하자면, 다양한 재료를 가지고 여러 가지 요리를 만들 수 있는 것과 같음.
  //             예를 들어, 같은 닭고기를 사용하여 찜닭, 튀김, 국 등 다양한 요리를 할 수 있음.
  //   순서 3) 예외 처리
  //           : 예외 처리는 프로그램 실행 중에 발생할 수 있는 오류를 처리하는 과정임.
  //             예를 들어, 사용자가 0 으로 나누려고 할 때 발생하는 오류를 처리함.
  //             비유하자면, 음식을 먹다가 갑자기 뭔가 잘못되었을 때(e.g: 이물질이 발견됨)
  //   순서 4) 입출력 처리
  //           : 런타임 시점에서 프로그램은 사용자 입력을 받고, 그에 대한 결과를 출력함.
  //             이는 프로그램이 실제로 동작하는 모습을 보여줌.
  //             비유하자면, 음식을 서빙하고, 손님이 음식을 먹으며 맛을 평가하는 것과 같음.
  //   순서 5) 동적 메모리 관리
  //           : 런타임 시점에서 프로그램은 동적으로 메모리를 할당ㅎ아고 해제함.
  //             가비지 컬렉션 Garbage Collection 시스템은 사용하지 않는 메모리를 자동으로 회수함.
  //             비유하자면, 음식을 먹고 남은 찌꺼기를 처리하거나, 필요 없는 접시를 치우는 과정과 같음.
  


  // < 컴파일 시점과 런타인 시점의 공통점 >
  
  // - 두 시점 모두 에러를 처리함.
  //   컴파일 시점: 구문 오류, 타입 오류를 잡아줌.
  //   런타임 시점: 예외를 처리함.
  // - 즉, 컴파일 시점에서는 코드의 오류를 잡아주고, 
  //   런타임 시점에서는 실행 중 발생할 수 있는 문제를 처리함.
  
  @OneToMany(() => HealthProfile, healthProfile => healthProfile.user)
  healthProfiles: HealthProfile[];


  @OneToMany(() => NutritionPlan, nutritionPlan => nutritionPlan.user)
  nutritionPlans: NutritionPlan[];

  @OneToMany(() => MealRecord, mealRecord => mealRecord.user)
  mealRecords: MealRecord[];

  @OneToMany(() => ExerciseRecord, exerciseRecord => exerciseRecord.user)
  exerciseRecords: ExerciseRecord[];

  @OneToMany(() => WaterIntakeRecord, waterIntakeRecord => waterIntakeRecord.user)
  waterIntakeRecords: WaterIntakeRecord[];

  @OneToMany(() => SleepRecord, sleepRecord => sleepRecord.user)
  sleepRecords: SleepRecord[];

  @OneToMany(() => MoodRecord, moodRecord => moodRecord.user)
  moodRecords: MoodRecord[];

  @OneToMany(() => SupplementRecord, supplementRecord => supplementRecord.user)
  supplementRecords: SupplementRecord[];

  @OneToMany(() => BloodSugarRecord, bloodSugarRecord => bloodSugarRecord.user)
  bloodSugarRecords: BloodSugarRecord[];

  @OneToMany(() => Allergy, allergy => allergy.user)
  allergies: Allergy[];

  @OneToMany(() => DietaryRestriction, dietaryRestriction => dietaryRestriction.user)
  dietaryRestrictions: DietaryRestriction[];
}