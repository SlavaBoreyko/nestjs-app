import { Controller, Get, Post, Put, Delete, Query, Param, ParseIntPipe, Body } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService){}

    @Get()
    getHomes(
        @Query('city') city?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('propertyType') propertyType?: PropertyType,
    ):Promise<HomeResponseDto[]> {

        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {gte: parseFloat(maxPrice)}),
        } : undefined;

        const filters = {
            ...(city && {city}),
            ...(price && {price}),
            ...(propertyType && {propertyType})
        }

        return this.homeService.getHomes(filters);
    }

    @Get(':id')
    getHome(@Param('id', ParseIntPipe) id: number){
        return this.homeService.getHomeById(id);
    }

    @Post()
    createHome(
        @Body() body: CreateHomeDto,
        @User() user: UserInfo
    ){
        return this.homeService.createHome(body, user.id);
    }

    @Put(':id')
    updateHome(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateHomeDto,
        @User() user: UserInfo
    ) {
        return this.homeService.updateHomeById(id, body);
    }

    @Delete(':id')
    deleteHome(
        @Param('id', ParseIntPipe) id: number, 
        @User() user: UserInfo
    ) {
        return this.homeService.deleteHomeById(id);
    }

}
