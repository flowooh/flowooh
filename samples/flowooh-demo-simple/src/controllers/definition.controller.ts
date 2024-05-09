import flowooh from '@flowooh/data';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller()
export class DefinitionController {
  @Get('/definitions')
  async definitionList() {
    const data = await flowooh.service.repo.definition.listDefinitions({
      published: [false, true],
    });
    return data;
  }

  @Get('/definition/info')
  async definitionInfo(@Query('id') id: string) {
    const data = await flowooh.service.repo.definition.getInfo(id);
    return data;
  }

  @Get('/definition/versions')
  async definitionVersions(@Query('id') id: string) {
    const data =
      await flowooh.service.repo.definitionContent.listDefinitionContents({
        definitionId: id,
      });
    return data;
  }

  @Get('/definition/version/content')
  async definitionVersionContent(@Query('id') id: string) {
    const data =
      await flowooh.service.repo.definitionContent.getRawContentById(id);
    return data;
  }

  @Post('/definition/create')
  async createDefinition(
    @Body()
    body: {
      name: string;
      description?: string;
      content?: string;
    },
  ) {
    const { name, description, content = '' } = body;
    const data = await flowooh.service.repo.definition.createDefinition({
      name,
      description,
      content,
      version: new Date().getTime().toString(),
    });
    return data;
  }

  @Post('/definition/editInfo')
  async editDefinitionInfo(
    @Body() body: { id: string; info: { name?: string; description?: string } },
  ) {
    const data = await flowooh.service.repo.definition.editDefinitionInfo(
      body.id,
      body.info as any,
    );
    return data;
  }
}
