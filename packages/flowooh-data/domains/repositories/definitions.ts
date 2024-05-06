import { BPMNDefinition, parse } from '@flowooh/core';
import { FlowoohRepoDefinitionContentData } from '@flowooh/data/tables/repositories/definition_contents';
import { FlowoohRepoDefinitionData } from '@flowooh/data/tables/repositories/definitions';
import { genId } from '../../utils/uid';
import { BaseService } from '../base';
import { Service } from '../decorator';

@Service('flowoohRepoDefinitionService')
export default class FlowoohRepoDefinitionService extends BaseService {
  /**
   * get list of workflow definitions
   * @returns
   */
  async listDefinitions(params: {
    nameLike?: string;
    published?: boolean[];
  }): Promise<Pick<FlowoohRepoDefinitionData, 'name' | 'description' | 'version' | 'id'>[]> {
    const { published = [true] } = params;
    const res = await this.k
      .from('flowooh_repo_definitions')
      .whereIn('published', published)
      .where((q) => params.nameLike && q.where('name', 'like', `%${params.nameLike}%`))
      .select('id', 'name', 'description', 'version');
    return res;
  }

  /**
   * get definition info
   * @param id
   * @returns
   */
  async getInfo(id: string): Promise<Pick<FlowoohRepoDefinitionData, 'name' | 'description' | 'version' | 'id'> | undefined> {
    if (!id) throw new Error('id is required');
    const res = await this.k<FlowoohRepoDefinitionData>('flowooh_repo_definitions')
      .where('id', id)
      .select('id', 'name', 'description', 'version')
      .first();
    return res;
  }

  /**
   * get raw content of a definition, this is a xml string
   * it will return the latest published version,
   * if not published version found, it will return the latest version
   * @param id
   * @returns
   */
  async getRawContent(id: string): Promise<string | undefined> {
    if (!id) throw new Error('id is required');

    const def = await this.k<FlowoohRepoDefinitionData>('flowooh_repo_definitions').where('id', id).select('id', 'version').first();
    if (!def) return undefined;

    const content = await this.service.repo.definitionContent.getRawContentByVersion(def.id, def.version);
    return content;
  }

  /**
   * get bpmn definition object from a definition
   * it will return the latest published version,
   * if not published version found, it will return the latest version
   * @param id
   * @returns {BPMNDefinition | undefined}
   */
  async getBpmnDefinition(id: string): Promise<BPMNDefinition | undefined> {
    if (!id) throw new Error('id is required');
    const content = await this.getRawContent(id);
    return content ? parse(content)['bpmn:definitions'] : undefined;
  }

  /**
   * create a new definition
   * @param data
   * @returns
   */
  async createDefinition(
    data: Pick<FlowoohRepoDefinitionData, 'name'> &
      Partial<Pick<FlowoohRepoDefinitionData, 'description'>> &
      Partial<Pick<FlowoohRepoDefinitionContentData, 'content' | 'version'>>,
  ): Promise<string> {
    if (!data.name) throw new Error('name is required');
    if (!data.description) throw new Error('description is required');
    if (!data.version) throw new Error('version is required');

    const defs = await this.k<FlowoohRepoDefinitionData>('flowooh_repo_definitions')
      .insert({ id: await genId(), name: data.name, description: data.description, published: false })
      .returning('id');

    await this.service.repo.definitionContent.createDefinitionContent(defs[0].id, {
      content: data.content,
      version: data.version,
    });

    return defs[0].id;
  }

  /**
   * edit definition content
   * @param id
   * @param data
   */
  async editDefinitionInfo(id: string, data: Partial<Pick<FlowoohRepoDefinitionData, 'name' | 'description'>>): Promise<void> {
    await this.k<FlowoohRepoDefinitionData>('flowooh_repo_definitions')
      .where('id', id)
      .update({
        name: data.name ?? undefined,
        description: data.description ?? undefined,
      });
  }
}
