import { BPMNDefinition } from '@flowooh-core/types';
import { parse } from '@flowooh-core/utils';
import { Knex } from 'knex';
import { FlowoohDefinitionContentData, FlowoohDefinitionData } from 'knex/types/tables';
import FlowoohRepoDefinitionContentRepository from './definition_contents';

export default class FlowoohRepoDefinitionRepository {
  private k: Knex;

  definitionContentRepository: FlowoohRepoDefinitionContentRepository;

  constructor(db: Knex) {
    this.k = db;
    this.definitionContentRepository = new FlowoohRepoDefinitionContentRepository(this.k);
  }

  /**
   * get list of workflow definitions
   * @returns
   */
  async listDefinitions(params: {
    nameLike?: string;
    published?: boolean[];
  }): Promise<Pick<FlowoohDefinitionData, 'name' | 'description' | 'version' | 'id'>[]> {
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
  async getInfo(
    id: string,
  ): Promise<Pick<FlowoohDefinitionData, 'name' | 'description' | 'version' | 'id'> | undefined> {
    if (!id) throw new Error('id is required');
    const res = await this.k<FlowoohDefinitionData>('flowooh_repo_definitions')
      .where('id', id)
      .select('id', 'name', 'description', 'version')
      .first();
    return res;
  }

  /**
   * get raw content of a definition, this is a xml string
   * @param id
   * @returns
   */
  async getRawContent(id: string): Promise<string | undefined> {
    if (!id) throw new Error('id is required');

    const def = await this.k<FlowoohDefinitionData>('flowooh_repo_definitions')
      .where('id', id)
      .select('id', 'version')
      .first();
    if (!def) return undefined;

    const content = await this.definitionContentRepository.getRawContent(def.id, def.version);
    return content;
  }

  /**
   * get bpmn definition object from a definition
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
    data: Pick<FlowoohDefinitionData, 'name' | 'description'> &
      Pick<FlowoohDefinitionContentData, 'content' | 'version'>,
  ): Promise<string> {
    if (!data.name) throw new Error('name is required');
    if (!data.description) throw new Error('description is required');
    if (!data.version) throw new Error('version is required');

    const defs = await this.k<FlowoohDefinitionData>('flowooh_repo_definitions')
      .insert({ name: data.name, description: data.description, published: false })
      .returning('id');

    await this.definitionContentRepository.createDefinitionContent(defs[0].id, {
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
  async editDefinitionInfo(id: string, data: Pick<FlowoohDefinitionData, 'name' | 'description'>): Promise<void> {
    await this.k<FlowoohDefinitionData>('flowooh_repo_definitions')
      .where('id', id)
      .update({
        name: data.name ?? null,
        description: data.description ?? null,
      });
  }

  /**
   * switch published version of a definition
   * @param id
   * @param version
   */
  async switchVersion(id: string, version: string): Promise<void> {
    const info = await this.definitionContentRepository.getInfo(id, version);

    if (!info) throw new Error('version not found');
    if (!info.published) throw new Error('version not published');

    await this.k<FlowoohDefinitionData>('flowooh_repo_definitions').where('id', id).update({ version });
  }
}
