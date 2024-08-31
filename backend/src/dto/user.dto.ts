import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsDate, IsUUID, IsNumber, Min, Max, IsBoolean, IsArray, IsEnum, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 기존 DTO들 (CreateUserDto, LoginUserDto, UpdateUserDto, ResetPasswordDto, ChangePasswordDto)은 그대로 유지

export class CreateHealthProfileDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsNumber({}, { message: '키는 숫자여야 합니다.' })
  @Min(0, { message: '키는 0보다 커야 합니다.' })
  @Max(300, { message: '키는 300cm를 초과할 수 없습니다.' })
  height: number;

  @IsNumber({}, { message: '체중은 숫자여야 합니다.' })
  @Min(0, { message: '체중은 0보다 커야 합니다.' })
  @Max(500, { message: '체중은 500kg을 초과할 수 없습니다.' })
  weight: number;

  @IsDate({ message: '유효한 생년월일 형식이 아닙니다.' })
  @Type(() => Date)
  birthDate: Date;

  @IsEnum(['male', 'female', 'other'], { message: '유효한 성별이 아닙니다.' })
  gender: string;

  @IsOptional()
  @IsArray({ message: '의료 조건은 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 의료 조건은 문자열이어야 합니다.' })
  medicalConditions?: string[];

  @IsOptional()
  @IsArray({ message: '알레르기는 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 알레르기는 문자열이어야 합니다.' })
  allergies?: string[];
}

export class CreateNutritionPlanDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsEnum(['weight_loss', 'muscle_gain', 'maintenance', 'health_improvement'], { message: '유효한 목표가 아닙니다.' })
  goal: string;

  @IsNumber({}, { message: '일일 칼로리 목표는 숫자여야 합니다.' })
  @Min(500, { message: '일일 칼로리 목표는 500 이상이어야 합니다.' })
  @Max(5000, { message: '일일 칼로리 목표는 5000을 초과할 수 없습니다.' })
  dailyCalorieTarget: number;

  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0 이상이어야 합니다.' })
  proteinTarget: number;

  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0 이상이어야 합니다.' })
  carbTarget: number;

  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0 이상이어야 합니다.' })
  fatTarget: number;

  @IsOptional()
  @IsArray({ message: '제외할 음식은 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 제외 음식은 문자열이어야 합니다.' })
  excludedFoods?: string[];
}

export class CreateMealDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsString({ message: '음식 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '음식 이름은 필수 입력 항목입니다.' })
  foodName: string;

  @IsNumber({}, { message: '칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  calories: number;

  @IsNumber({}, { message: '단백질은 숫자여야 합니다.' })
  @Min(0, { message: '단백질은 0 이상이어야 합니다.' })
  protein: number;

  @IsNumber({}, { message: '탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물은 0 이상이어야 합니다.' })
  carbs: number;

  @IsNumber({}, { message: '지방은 숫자여야 합니다.' })
  @Min(0, { message: '지방은 0 이상이어야 합니다.' })
  fat: number;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  eatenAt: Date;

  @IsEnum(['breakfast', 'lunch', 'dinner', 'snack'], { message: '유효한 식사 유형이 아닙니다.' })
  mealType: string;
}

export class CreateExerciseRecordDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsString({ message: '운동 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '운동 이름은 필수 입력 항목입니다.' })
  exerciseName: string;

  @IsNumber({}, { message: '지속 시간은 숫자여야 합니다.' })
  @IsPositive({ message: '지속 시간은 양수여야 합니다.' })
  duration: number;

  @IsNumber({}, { message: '소모 칼로리는 숫자여야 합니다.' })
  @IsPositive({ message: '소모 칼로리는 양수여야 합니다.' })
  caloriesBurned: number;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  exerciseDate: Date;
}

export class CreateWaterIntakeRecordDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsNumber({}, { message: '섭취량은 숫자여야 합니다.' })
  @IsPositive({ message: '섭취량은 양수여야 합니다.' })
  amount: number;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  intakeTime: Date;
}

export class CreateSleepRecordDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsDate({ message: '유효한 취침 시간 형식이 아닙니다.' })
  @Type(() => Date)
  sleepTime: Date;

  @IsDate({ message: '유효한 기상 시간 형식이 아닙니다.' })
  @Type(() => Date)
  wakeTime: Date;

  @IsNumber({}, { message: '수면 품질은 숫자여야 합니다.' })
  @Min(1, { message: '수면 품질은 1 이상이어야 합니다.' })
  @Max(10, { message: '수면 품질은 10 이하여야 합니다.' })
  sleepQuality: number;
}

export class CreateMoodRecordDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsEnum(['happy', 'sad', 'neutral', 'stressed', 'excited'], { message: '유효한 감정 상태가 아닙니다.' })
  mood: string;

  @IsOptional()
  @IsString({ message: '메모는 문자열이어야 합니다.' })
  note?: string;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  recordTime: Date;
}

export class CreateNutritionSuggestionDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsArray({ message: '추천 영양제는 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 영양제는 문자열이어야 합니다.' })
  suggestedSupplements: string[];

  @IsArray({ message: '추천 음식은 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 음식은 문자열이어야 합니다.' })
  suggestedFoods: string[];

  @IsOptional()
  @IsString({ message: '추가 조언은 문자열이어야 합니다.' })
  additionalAdvice?: string;
}

export class CreateCommunityPostDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력 항목입니다.' })
  @MinLength(5, { message: '제목은 최소 5자 이상이어야 합니다.' })
  title: string;

  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수 입력 항목입니다.' })
  @MinLength(10, { message: '내용은 최소 10자 이상이어야 합니다.' })
  content: string;

  @IsOptional()
  @IsArray({ message: '태그는 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 태그는 문자열이어야 합니다.' })
  tags?: string[];
}

export class CreateChallengeDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력 항목입니다.' })
  title: string;

  @IsString({ message: '설명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '설명은 필수 입력 항목입니다.' })
  description: string;

  @IsDate({ message: '유효한 시작 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  startDate: Date;

  @IsDate({ message: '유효한 종료 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  endDate: Date;

  @IsNumber({}, { message: '목표는 숫자여야 합니다.' })
  @IsPositive({ message: '목표는 양수여야 합니다.' })
  goal: number;

  @IsEnum(['steps', 'calories', 'water', 'exercise'], { message: '유효한 챌린지 유형이 아닙니다.' })
  challengeType: string;
}

export class JoinChallengeDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsNotEmpty({ message: '챌린지 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 챌린지 ID가 아닙니다.' })
  challengeId: string;
}

export class CreateExpertConsultationDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsNotEmpty({ message: '전문가 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 전문가 ID가 아닙니다.' })
  expertId: string;

  @IsString({ message: '상담 주제는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '상담 주제는 필수 입력 항목입니다.' })
  consultationTopic: string;

  @IsDate({ message: '유효한 예약 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  appointmentDate: Date;

  @IsOptional()
  @IsString({ message: '추가 메모는 문자열이어야 합니다.' })
  additionalNotes?: string;
}

export class CreateCustomExerciseProgramDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsEnum(['weight_loss', 'muscle_gain', 'endurance', 'flexibility'], { message: '유효한 운동 목표가 아닙니다.' })
  goal: string;

  @IsNumber({}, { message: '주간 운동 일수는 숫자여야 합니다.' })
  @Min(1, { message: '주간 운동 일수는 최소 1일이어야 합니다.' })
  @Max(7, { message: '주간 운동 일수는 최대 7일이어야 합니다.' })
  daysPerWeek: number;

  @IsNumber({}, { message: '1회 운동 시간은 숫자여야 합니다.' })
  @Min(10, { message: '1회 운동 시간은 최소 10분이어야 합니다.' })
  @Max(240, { message: '1회 운동 시간은 최대 240분이어야 합니다.' })
  minutesPerSession: number;

  @IsOptional()
  @IsArray({ message: '선호하는 운동은 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 선호 운동은 문자열이어야 합니다.' })
  preferredExercises?: string[];

  @IsOptional()
  @IsArray({ message: '제외할 운동은 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 제외 운동은 문자열이어야 합니다.' })
  excludedExercises?: string[];
}

export class CreateDailyNutrientGoalDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsNumber({}, { message: '단백질 목표는 숫자여야 합니다.' })
  @Min(0, { message: '단백질 목표는 0 이상이어야 합니다.' })
  proteinGoal: number;

  @IsNumber({}, { message: '탄수화물 목표는 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물 목표는 0 이상이어야 합니다.' })
  carbGoal: number;

  @IsNumber({}, { message: '지방 목표는 숫자여야 합니다.' })
  @Min(0, { message: '지방 목표는 0 이상이어야 합니다.' })
  fatGoal: number;

  @IsOptional()
  @IsNumber({}, { message: '비타민 C 목표는 숫자여야 합니다.' })
  @Min(0, { message: '비타민 C 목표는 0 이상이어야 합니다.' })
  vitaminCGoal?: number;

  @IsOptional()
  @IsNumber({}, { message: '칼슘 목표는 숫자여야 합니다.' })
  @Min(0, { message: '칼슘 목표는 0 이상이어야 합니다.' })
  calciumGoal?: number;
}

export class CreateRestaurantReviewDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsString({ message: '식당 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '식당 이름은 필수 입력 항목입니다.' })
  restaurantName: string;

  @IsNumber({}, { message: '평점은 숫자여야 합니다.' })
  @Min(1, { message: '평점은 1 이상이어야 합니다.' })
  @Max(5, { message: '평점은 5 이하여야 합니다.' })
  rating: number;

  @IsString({ message: '리뷰 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '리뷰 내용은 필수 입력 항목입니다.' })
  @MinLength(10, { message: '리뷰 내용은 최소 10자 이상이어야 합니다.' })
  review: string;

  @IsOptional()
  @IsArray({ message: '건강식 옵션은 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 건강식 옵션은 문자열이어야 합니다.' })
  healthyOptions?: string[];

  @IsDate({ message: '유효한 방문 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  visitDate: Date;
}

export class CreateBloodSugarRecordDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsNumber({}, { message: '혈당 수치는 숫자여야 합니다.' })
  @Min(20, { message: '혈당 수치는 20 이상이어야 합니다.' })
  @Max(600, { message: '혈당 수치는 600 이하여야 합니다.' })
  bloodSugarLevel: number;

  @IsDate({ message: '유효한 측정 시간 형식이 아닙니다.' })
  @Type(() => Date)
  measuredAt: Date;

  @IsEnum(['fasting', 'before_meal', 'after_meal', 'before_sleep'], { message: '유효한 측정 상황이 아닙니다.' })
  measurementContext: string;

  @IsOptional()
  @IsString({ message: '메모는 문자열이어야 합니다.' })
  notes?: string;
}

export class CreateGroceryListDto {
  @IsNotEmpty({ message: '사용자 ID는 필수 입력 항목입니다.' })
  @IsUUID('4', { message: '유효한 사용자 ID가 아닙니다.' })
  userId: string;

  @IsArray({ message: '식료품 목록은 배열이어야 합니다.' })
  @ValidateNested({ each: true })
  @Type(() => GroceryItemDto)
  items: GroceryItemDto[];

  @IsOptional()
  @IsString({ message: '메모는 문자열이어야 합니다.' })
  notes?: string;
}

export class GroceryItemDto {
  @IsString({ message: '식품 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '식품 이름은 필수 입력 항목입니다.' })
  name: string;

  @IsNumber({}, { message: '수량은 숫자여야 합니다.' })
  @IsPositive({ message: '수량은 양수여야 합니다.' })
  quantity: number;

  @IsOptional()
  @IsString({ message: '단위는 문자열이어야 합니다.' })
  unit?: string;
}