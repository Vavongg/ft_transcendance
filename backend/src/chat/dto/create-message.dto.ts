import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content: string;
}

// telecharger et ajouter de le vocabula machin pour un second checking des valeurs