import { IsString, IsNumber, IsArray, ValidateNested, Min, Max, IsEnum, IsOptional, ArrayMinSize, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class CreateIngredientInRecipeDto {
  @IsString()
  @MaxLength(36)
  ingredientId: string;

  @IsNumber()
  @Min(0.1)
  @Max(10000)
  amount: number;

  @IsString()
  @MaxLength(20)
  unit: string;
}

class CreateNutritionInfoDto {
  @IsNumber()
  @Min(0)
  @Max(10000)
  calories: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  protein: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  carbs: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  fat: number;
}

export class CreateRecipeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;
  /**
   * 레시피 이름
   * 목적: 레시피의 고유 이름을 저장
   * 제약: 3-100자 사이의 문자열
   * 처리 단계:
   * 1) 입력값 수신
   * 2) 길이 검증
   * 3) 특수문자 필터링 (필요시)
   * 4) 중복 이름 검사
   * 5) 데이터베이스에 저장
   */

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;
  /**
   * 레시피 설명
   * 목적: 레시피에 대한 간단한 설명 제공
   * 제약: 10-1000자 사이의 문자열
   * 처리 단계:
   * 1) 입력값 수신
   * 2) 길이 검증
   * 3) HTML 태그 이스케이핑
   * 4) 마크다운 지원 (선택적)
   * 5) 데이터베이스에 저장
   */

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateIngredientInRecipeDto)
  ingredients: CreateIngredientInRecipeDto[];
  /**
   * 레시피 재료
   * 목적: 레시피에 필요한 재료 목록 저장
   * 구조: CreateIngredientInRecipeDto 객체의 배열
   * 처리 단계:
   * 1) 재료 목록 수신
   * 2) 각 재료의 유효성 검사
   * 3) 재료 ID의 존재 여부 확인
   * 4) 영양 정보 계산
   * 5) 데이터베이스에 저장
   */

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @MaxLength(500, { each: true })
  instructions: string[];
  /**
   * 조리 단계
   * 목적: 조리 단계 저장
   * 제약: 최소 1개 이상의 단계, 각 단계 최대 500자
   * 처리 단계:
   * 1) 조리 단계 목록 수신
   * 2) 각 단계의 길이 검증
   * 3) HTML 이스케이핑
   * 4) 데이터베이스에 저장
   */

  @IsNumber()
  @Min(1)
  @Max(100)
  servings: number;
  /**
   * 레시피 인분 수
   * 목적: 레시피의 인분 수 지정
   * 제약: 1-100 사이의 정수
   * 처리 단계:
   * 1) 인분 수 수신
   * 2) 유효 범위 검증
   * 3) 영양 정보 계산에 반영
   * 4) 데이터베이스에 저장
   */

  @IsNumber()
  @Min(0)
  @Max(1440)
  prepTime: number;
  /**
   * 준비 시간
   * 목적: 레시피 준비에 필요한 시간 지정
   * 제약: 0-1440분 사이의 정수
   * 처리 단계:
   * 1) 준비 시간 수신
   * 2) 유효 범위 검증
   * 3) 총 소요 시간 계산에 사용
   * 4) 데이터베이스에 저장
   */

  @IsNumber()
  @Min(0)
  @Max(1440)
  cookTime: number;
  /**
   * 조리 시간
   * 목적: 실제 조리에 필요한 시간 지정
   * 제약: 0-1440분 사이의 정수
   * 처리 단계:
   * 1) 조리 시간 수신
   * 2) 유효 범위 검증
   * 3) 총 소요 시간 계산에 사용
   * 4) 데이터베이스에 저장
   */

  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: string;
  /**
   * 난이도
   * 목적: 레시피의 난이도 지정
   * 제약: 'easy', 'medium', 'hard' 중 하나
   * 처리 단계:
   * 1) 난이도 수신
   * 2) Enum 값 검증
   * 3) 데이터베이스에 저장
   */

  @ValidateNested()
  @Type(() => CreateNutritionInfoDto)
  nutritionInfo: CreateNutritionInfoDto;
  /**
   * 영양 정보
   * 목적: 레시피의 영양 정보 저장
   * 구조: CreateNutritionInfoDto 객체
   * 처리 단계:
   * 1) 영양 정보 수신
   * 2) 각 영양소 값의 유효성 검사
   * 3) 총 칼로리와 영양소 합 일치 여부 확인
   * 4) 데이터베이스에 저장
   */

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @MaxLength(20, { each: true })
  tags?: string[];
  /**
   * 태그
   * 목적: 레시피 분류 및 검색 용이성 제공
   * 제약: 선택적, 각 태그 최대 20자
   * 처리 단계:
   * 1) 태그 목록 수신
   * 2) 각 태그 길이 검증
   * 3) 중복 제거 및 정규화
   * 4) 데이터베이스에 저장
   */

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;
  /**
   * 이미지 URL
   * 목적: 레시피 이미지 URL 저장
   * 제약: 선택적, 최대 255자
   * 처리 단계:
   * 1) URL 수신
   * 2) 문자열 길이 검증
   * 3) URL 형식 검증
   * 4) 데이터베이스에 저장
   */
}