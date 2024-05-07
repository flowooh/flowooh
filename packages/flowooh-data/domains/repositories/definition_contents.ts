import { FlowoohRepoDefinitionContentData } from '@flowooh/data/tables/repositories/definition_contents';
import dayjs from 'dayjs';
import { genId } from '../../utils/uid';
import { BaseService } from '../base';
import { Service } from '../decorator';

@Service('flowoohRepoDefinitionContentService')
export default class FlowoohRepoDefinitionContentService extends BaseService {
  /**
   * get list of workflow definitions
   * @returns
   */
  async listDefinitionContents(params: {
    definitionId: string;
  }): Promise<Pick<FlowoohRepoDefinitionContentData, 'id' | 'version' | 'published' | 'created_at' | 'updated_at'>[]> {
    const res = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents')
      .where('definition_id', params.definitionId)
      .select('id', 'version', 'published', 'created_at', 'updated_at');
    return res;
  }

  async getInfo(defId: string, version: string): Promise<Pick<FlowoohRepoDefinitionContentData, 'id' | 'published'> | undefined> {
    const res = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents')
      .where('definition_id', defId)
      .where('version', version)
      .select('id', 'version', 'published', 'created_at', 'updated_at')
      .first();
    return res;
  }

  async getRawContentById(id: string): Promise<string | undefined> {
    if (!id) throw new Error('defId is required');
    const def = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents').where('id', id).select('content').first();

    return def?.content;
  }

  async getRawContentByVersion(defId: string, version: string): Promise<string | undefined> {
    if (!defId) throw new Error('defId is required');
    if (!version) throw new Error('version is required');

    const def = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents')
      .where('definition_id', defId)
      .where('version', version)
      .select('content')
      .first();

    return def?.content;
  }

  /**
   * create a new definition content
   * @param defId
   * @param data
   * @returns
   */
  async createDefinitionContent(defId: string, data: Partial<Pick<FlowoohRepoDefinitionContentData, 'version' | 'content'>>): Promise<string> {
    if (!data.content) {
      data.content = '';
    }
    if (!data.version) {
      data.version = dayjs().unix().toString();
    }
    const latest = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents')
      .where('definition_id', defId)
      .orderBy('version', 'desc')
      .select('version')
      .first();
    if (latest && latest.version === data.version) throw new Error('version already exists');
    if (latest && latest.version > data.version) throw new Error('version is lower than the latest version');

    const c = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents')
      .insert({
        id: await genId(),
        definition_id: defId,
        content: data.content,
        version: data.version,
        published: false,
      })
      .returning('id');

    return c[0].id;
  }

  /**
   * edit definition content, every edit will create a new record with a new version
   * @param id
   * @param content
   * @returns
   */
  async editDefinitionContent(id: string, content: string): Promise<void> {
    const origin = await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents').where('id', id).select().first();

    if (!origin) throw new Error('definition not found');

    if (origin.published) {
      throw new Error('cannot edit published definition');
    }

    await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents').where('id', id).update({
      content: content,
    });
  }

  /**
   * publish a definition
   * @param id
   */
  async publishDefinitionContent(id: string): Promise<void> {
    await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents').where('id', id).update({ published: true });
  }

  /**
   * unpublish a definition
   * @param id
   */
  async unpublishDefinitionContent(id: string): Promise<void> {
    await this.k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents').where('id', id).update({ published: false });
  }
}
