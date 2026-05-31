import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class AddPortfolioAssetDto {
  @IsString()
  @IsNotEmpty()
  symbol!: string;

  // Store as string to avoid floating point issues; validate as a numeric string.
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, { message: 'amount must be a numeric string' })
  amount!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  chain?: string;

  @IsOptional()
  @IsString()
  coingeckoId?: string | null;
}

