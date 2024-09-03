// Recipe 엔티티:


// 요리 레시피 정보를 상세히 저장
// 레시피 이름, 조리법, 소요 시간, 난이도 등 포함
// 레시피의 영양 정보 (칼로리, 단백질, 탄수화물, 지방 등) 저장
// 식단 계획 및 추천 시스템에 활용
// 연관 관계:

// Ingredient와 M:N 관계 (하나의 레시피는 여러 재료를 포함하고, 하나의 재료는 여러 레시피에 사용될 수 있음)
// NutritionPlan과 M:N 관계


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Ingredient } from './ingredient.entity';

class IngredientAmount {
  @IsNotEmpty()
  ingredientId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  unit: string;
}

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty({ message: '레시피 이름은 필수입니다.' })
  name: string;

  @Column('text')
  @IsNotEmpty({ message: '레시피 설명은 필수입니다.' })
  description: string;

  @Column('int')
  @IsNumber({}, { message: '준비 시간은 숫자여야 합니다.' })
  @Min(0, { message: '준비 시간은 0분 이상이어야 합니다.' })
  prepTime: number; // 단위: 분

  @Column('int')
  @IsNumber({}, { message: '조리 시간은 숫자여야 합니다.' })
  @Min(0, { message: '조리 시간은 0분 이상이어야 합니다.' })
  cookTime: number; // 단위: 분

  @Column('int')
  @IsNumber({}, { message: '서빙 수는 숫자여야 합니다.' })
  @Min(1, { message: '서빙 수는 1 이상이어야 합니다.' })
  servings: number;

  @Column('simple-array')
  @IsArray()
  @IsNotEmpty({ each: true, message: '각 조리 단계는 비어있지 않아야 합니다.' })
  instructions: string[];

  @Column('simple-json')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientAmount)
  ingredientAmounts: IngredientAmount[];

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: Ingredient[];

  @Column('float')
  @IsNumber({}, { message: '칼로리는 숫자여야 합니다.' })
  @Min(0, { message: '칼로리는 0 이상이어야 합니다.' })
  calories: number;

  @Column('float')
  @IsNumber({}, { message: '단백질은 숫자여야 합니다.' })
  @Min(0, { message: '단백질은 0 이상이어야 합니다.' })
  protein: number;

  @Column('float')
  @IsNumber({}, { message: '탄수화물은 숫자여야 합니다.' })
  @Min(0, { message: '탄수화물은 0 이상이어야 합니다.' })
  carbs: number;

  @Column('float')
  @IsNumber({}, { message: '지방은 숫자여야 합니다.' })
  @Min(0, { message: '지방은 0 이상이어야 합니다.' })
  fat: number;

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true })
  photoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 영양 정보 계산 메서드
  calculateNutrition() {
    this.calories = 0;
    this.protein = 0;
    this.carbs = 0;
    this.fat = 0;

    this.ingredientAmounts.forEach(ia => {
      const ingredient = this.ingredients.find(i => i.id === ia.ingredientId);
      if (ingredient) {
        const factor = ia.amount / 100; // 영양 정보는 보통 100g 기준으로 저장됨
        this.calories += ingredient.calories * factor;
        this.protein += ingredient.protein * factor;
        this.carbs += ingredient.carbs * factor;
        this.fat += ingredient.fat * factor;
      }
    });

    // 1인분 기준으로 조정
    this.calories /= this.servings;
    this.protein /= this.servings;
    this.carbs /= this.servings;
    this.fat /= this.servings;
  }

  // 레시피 요약 생성 메서드
  generateSummary(): string {
    let summary = `레시피: ${this.name}\n\n`;
    summary += `설명: ${this.description}\n\n`;
    summary += `준비 시간: ${this.prepTime}분\n`;
    summary += `조리 시간: ${this.cookTime}분\n`;
    summary += `서빙 수: ${this.servings}\n\n`;
    summary += "재료:\n";
    this.ingredientAmounts.forEach(ia => {
      const ingredient = this.ingredients.find(i => i.id === ia.ingredientId);
      if (ingredient) {
        summary += `- ${ingredient.name}: ${ia.amount} ${ia.unit}\n`;
      }
    });
    summary += "\n조리 방법:\n";
    this.instructions.forEach((step, index) => {
      summary += `${index + 1}. ${step}\n`;
    });
    summary += "\n영양 정보 (1인분 기준):\n";
    summary += `칼로리: ${this.calories.toFixed(2)} kcal\n`;
    summary += `단백질: ${this.protein.toFixed(2)} g\n`;
    summary += `탄수화물: ${this.carbs.toFixed(2)} g\n`;
    summary += `지방: ${this.fat.toFixed(2)} g\n`;
    summary += `\n태그: ${this.tags.join(', ')}`;
    return summary;
  }

  // 특정 식이 제한에 맞는지 확인하는 메서드
  checkDietaryRestrictions(restrictions: string[]): boolean {
    return this.ingredients.every(ingredient => 
      !restrictions.some(restriction => 
        ingredient.dietaryRestrictions?.includes(restriction)
      )
    );
  }
}