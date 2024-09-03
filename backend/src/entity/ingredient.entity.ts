// Ingredient 엔티티:


// 개별 식재료에 대한 정보 저장
// 식재료 이름, 기본 단위, 영양 정보 포함
// 레시피 구성 및 영양 계산에 활용
// 연관 관계:

// Recipe와 M:N 관계
// FoodDatabase와 1:1 또는 1:N 관계 (식재료 정보가 음식 데이터베이스의 일부가 될 수 있음)


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: '재료 이름은 필수입니다.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: '기본 계량 단위는 필수입니다.' })
  baseUnit: string;

  @Column('float')
  @IsNumber({}, { message: '칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  calories: number; // 100g 당 칼로리

  @Column('float')
  @IsNumber({}, { message: '단백질은 숫자여야 합니다.' })
  @Min(0, { message: '단백질은 0 이상이어야 합니다.' })
  protein: number; // 100g 당 단백질 (g)

  @Column('float')
  @IsNumber({}, { message: '탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물은 0 이상이어야 합니다.' })
  carbs: number; // 100g 당 탄수화물 (g)

  @Column('float')
  @IsNumber({}, { message: '지방은 숫자여야 합니다.' })
  @Min(0, { message: '지방은 0 이상이어야 합니다.' })
  fat: number; // 100g 당 지방 (g)


  // < >

  // - '@Column('float', { nullable: true })'
  //   : - 이 'ingredient 엔티티의 fiber 속성'이 DB 테이블 ingredient 에서 하나의 컬럼 column 으로 매핑됨.
  //     - 'float'
  //       : 이 컬럼을 float 데이터 타입으로 지정하여,
  //         이 컬럼이 '소수점이 포함된 숫자(= 실수)'를 저장할 수 있도록 함.
  //     - '{ nullable: true }'
  //       : - 이 '속성 fiber'에 해당하는 컬럼이 null 값을 가질 수 있음을 명시해줌. 
  //           즉, 이 fiber 컬럼은 '비어 있을 수 있다'는 것이다!!
  //         - 비유하자면, '학생들의 정보가 담긴 카드(= 테이블 Ingredient)'가 있고, 이 카드에는 각 학생들의 이름, 생년월일, 주소(= 컬럼 fiber) 등이 기재되는데,
  //           어떤 학생들은 '주소(= 속성 fiber)'를 입력하지 않을 수도 있음.
  //           이런 경우, 그 카드(= 테이블 Ingredient)의 주소(= 컬럼 fiber)란이 비어있게 됨.
  //           nullable: true 는 이와 같은 상황을 허용하는 것임.
  // - '@IsOptional'
  //   : - '유효성 검사 데코레이터들을 담고 있는 class-validator 라이브러리'에 있는 데코레이터임.
  //       이 데코레이터는 여기서 '속성 fiber'가 선택적 optional 임을 명시함.
  //       즉, 이 컬럼 fiber 에 대한 정보는, 테이블 Ingredient 를 생성할 때 필수적으로 제공되지 않아도 된다는 것을 의미함!!
  //     - 비유하자면, 피자를 주문할 때 추가 토핑을 선택할 수 있음.
  //       하지만, 추가 토핑을 선택하지 않아도 피자를 주문할 수 있음.
  //       이와 비슷하게, 여기서 @IsOptional() 은 fiber 속성이 Ingredient 객체를 생성할 때 꼭 필요한 것은 아니라는 것을 의미함.
  //       즉, fiber 속성이 제공되지 않더라도 Ingredient 객체는 유효하게 생성된다!!


  // ***중요***
  // < 'nullable: true' 와 '@IsOptional' 비교 >
  // 
  // - nullable: true
  //  : - 'DB 레벨'에서 적용됨. 
  //      DB에서 'Ingeredient 테이블'에 이 '컬럼 fiber'가 생성될 때, 그 '컬럼 fiber' 에 들어갈 '행, 레코드'에 null 값을 허용한다는 것을 의미함.
  //      즉, 데이터가 DB 에 저장될 때 적용됨.
  //      그러므로, 'Ingredient 테이블'의 '컬럼 fiber'에 아무 레코드도 없어서,
  //      이 '컬럼 fiber'가 컬럼 이름만 생성되었고, 그 내부 실제 내용은 아무런 레코드가 없어도 되는 것이다!!
  // - @IsOptional
  //  : - '코드의 유효성 검사 레벨'에서 적용됨.
  //      회원가입할 때 사용자가 '필드 fiber'에 대한 정보를 입력하지 않아서,
  //      이 '필드 fiber'가 '객체 Ingredient'에 포함되지 않더라도, 
  //      유효성 검사에서 오류가 발생하지 않음.
  //    - 비유하자면, 온라인으로 회원가입을 할 때, 필수적으로 입력해야 하는 정보(e.g: 이름, 이메일 등) 외에도,
  //      선택적으로 입력할 수 있는 추가 정보(e.g: 생일, 취미)에 대해서,
  //      사용자가 해당 추가 정보를 입력하지 않아도 회원 가입 절차가 정상적으로 완료되도록 하는 것임.
  //      즉, 사용자로부터 '필드 fiber'에 대한 정보를 받지 못하더라도,
  //      'Ingredient 객체'를 생성할 때 아무 문제가 없는 것이다!!


  // - '@IsNumber({}, { message: '식이섬유는 숫자여야 합니다.'})
  //    : - '유효성 검사 데코레이터들을 담고 있는 class-validator 라이브러리'에 있는 데코레이터임.
  //      - '첫 번째 괄호 {}'
  //        : - @IsNumber 데코레이터의 첫 번째 괄호는 '옵션 객체'이다.
  //            옵션 객체(첫 번째 괄호)는 이 IsNumber 데코레이터에 전달한 '옵션'들을 포함함.
  //            이 옵션들은 이 IsNumber 데코레이터ㅏ 어떻게 동작할지를 세부적으로 정의하는 데 사용됨.
  //          - 여기서 '빈 객체 {}' 가 전달된 이유
  //            : 현재 코드에서는 추가 옵션이 필요하지 않기 때문에 '빈 객체 {}'를 전달한 것임.
  //              즉, '옵션 없이 기본 설정으로 이 데코레이터를 사용하겠다'라는 뜻임.
  //          - 비유하자면, 마치 주문서를 작성할 때 추가 요청 사항이 없어서 빈칸으로 남겨둔 것과 같음.
  //            예를 들어, 피자 주문서에 "추가 요청 사항" 칸이 있지만, 특별히 요청할 사항이 없으면 빈칸으로 남겨두는 것과 같은 원리임.
  //      - '두 번째 괄호 {}'
  //        : @IsNumber 데코레이터의 두 번째 괄호는 '메시지 객체'이다.
  //          메시지 객체(두 번째 괄호)는 '@IsNumber 데코레이터가 적용된 필드에 대한 유효성 검사 실패 시 출력될 메시지'를 설정하는 데 사용됨.
  //          즉, 여기서는 '필드 fiber' 에 '숫자가 아닌 값이 들어왔을 때' 사용자에게 표시해주는 메시지를 말해주고 있음. 
  // - 'Min(0, { message: '식이섬유는 0 이상이어야 합니다.' })
  //   : - '유효성 검사 데코레이터들을 담고 있는 class-validator 라이브러리'에서 제공하는 데코레이터
  //     - 이 필드 fiber 의 '숫자 최소 값이 0 이상'이어야 함을 명시해주는 것임.
  //       즉, 필드 fiber 의 값이 0 보다 작을 수 없음을 의미하는 것임!
  // - 'fiber?: number'
  //   : 
  @Column('float', { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '식이섬유는 숫자여야 합니다.' })
  @Min(0, { message: '식이섬유는 0 이상이어야 합니다.' })
  fiber?: number; // 100g 당 식이섬유 (g)

  @Column('float', { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '당류는 숫자여야 합니다.' })
  @Min(0, { message: '당류는 0 이상이어야 합니다.' })
  sugar?: number; // 100g 당 당류 (g)

  @Column('simple-array', { nullable: true })
  allergens?: string[]; // 알레르기 유발 성분 목록

  @Column('simple-array', { nullable: true })
  dietaryRestrictions?: string[]; // 식이 제한 정보 (예: 채식, 글루텐 프리 등)

  @Column({ nullable: true })
  seasonality?: string; // 제철 정보

  @Column({ nullable: true })
  origin?: string; // 원산지 정보

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 특정 양에 대한 영양 정보 계산 메서드
  calculateNutritionForAmount(amount: number, unit: string): {calories: number, protein: number, carbs: number, fat: number} {
    const factor = this.convertToBaseUnit(amount, unit) / 100;
    return {
      calories: this.calories * factor,
      protein: this.protein * factor,
      carbs: this.carbs * factor,
      fat: this.fat * factor
    };
  }

  // 단위 변환 메서드 (예시, 실제로는 더 복잡할 수 있음)
  private convertToBaseUnit(amount: number, unit: string): number {
    switch(unit) {
      case 'g':
        return amount;
      case 'kg':
        return amount * 1000;
      case 'oz':
        return amount * 28.35;
      // 다른 단위들에 대한 변환 로직 추가
      default:
        return amount;
    }
  }
}