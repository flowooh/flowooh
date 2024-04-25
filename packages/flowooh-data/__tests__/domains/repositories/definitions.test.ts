import { data as k } from '@flowooh-data/data';
import { service } from '@flowooh-data/domains';
import { FlowoohRepoDefinitionContentData, FlowoohRepoDefinitionData } from 'knex/types/tables';

describe('FlowoohRepoDefinitionRepository', () => {
  const mockDefinitions: Partial<FlowoohRepoDefinitionData>[] = [
    // 生成测试数据
    {
      id: '1',
      name: 'Example 1',
      description: 'This is an example',
      version: '1.0.0',
      published: true,
    },
    {
      id: '2',
      name: 'Example 2',
      description: 'This is another example',
      version: '3.0.0',
      published: false,
    },
    {
      id: '3',
      name: 'Example 3',
      description: 'This is yet another example',
      version: '3.0.0',
      published: true,
    },
    {
      id: '4',
      name: 'Example 4',
      description: 'This is the last example',
      version: '4.0.0',
      published: true,
    },
  ];

  const mockDefinitionContents: Partial<FlowoohRepoDefinitionContentData>[] = [
    {
      id: '1',
      definition_id: '1',
      version: '1.0.0',
      content: `
      <bpmn:definitions>
        <bpmn:process id="Process_1igpwhg" isExecutable="false">
            <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
                <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
            </bpmn:startEvent>
        </bpmn:process>
      </bpmn:definitions>`,
    },
    {
      id: '2',
      definition_id: '1',
      version: '2.0.0',
    },
    {
      id: '3',
      definition_id: '2',
      version: '3.0.0',
      content: `
      <bpmn:definitions>
        <bpmn:process id="Process_1igpwhg" isExecutable="false">
            <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
                <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
            </bpmn:startEvent>
        </bpmn:process>
      </bpmn:definitions>`,
    },
    {
      id: '4',
      definition_id: '2',
      version: '4.0.0',
    },
  ];

  beforeAll(async () => {
    await k.schema.createTable('flowooh_repo_definitions', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.string('version');
      table.boolean('enabled');
      table.boolean('published');
      table.string('content');
    });

    await k.schema.createTable('flowooh_repo_definition_contents', (table) => {
      table.increments('id').primary();
      table.string('definition_id');
      table.string('version');
      table.string('content');
      table.boolean('published');
    });

    await k.insert(mockDefinitions).into('flowooh_repo_definitions');
    await k.insert(mockDefinitionContents).into('flowooh_repo_definition_contents');
  });

  describe('listDefinitions', () => {
    it('should return the correct list of definitions when no filters are provided', async () => {
      // Arrange
      const params = {};

      // Act
      const result = await service.repo.definition.listDefinitions(params);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return the correct list of definitions when filtering by published with true', async () => {
      // Arrange
      const params = {
        published: [true],
      };

      // Act
      const result = await service.repo.definition.listDefinitions(params);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0].name).toBe(mockDefinitions[0].name);
      expect(result[0].description).toBe(mockDefinitions[0].description);
      expect(result[0].version).toBe(mockDefinitions[0].version);
    });

    it('should return the correct list of definitions when filtering by published with false', async () => {
      // Arrange
      const params = {
        published: [false],
      };

      // Act
      const result = await service.repo.definition.listDefinitions(params);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0].name).toBe(mockDefinitions[1].name);
      expect(result[0].description).toBe(mockDefinitions[1].description);
      expect(result[0].version).toBe(mockDefinitions[1].version);
    });

    it('should return the correct list of definitions when filtering by published with all options', async () => {
      // Arrange
      const params = {
        published: [true, false],
      };

      // Act
      const result = await service.repo.definition.listDefinitions(params);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });

    it('should return the correct list of definitions when filtering by name', async () => {
      // Arrange
      const params = {
        nameLike: 'Example 1',
      };

      // Act
      const result = await service.repo.definition.listDefinitions(params);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0].name).toBe(mockDefinitions[0].name);
      expect(result[0].description).toBe(mockDefinitions[0].description);
      expect(result[0].version).toBe(mockDefinitions[0].version);
    });

    it('should return the correct list of definitions when filtering by name with wildcard', async () => {
      // Arrange
      const params = {
        nameLike: 'Example',
      };

      // Act
      const result = await service.repo.definition.listDefinitions(params);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0].name).toBe(mockDefinitions[0].name);
      expect(result[1].name).toBe(mockDefinitions[2].name);
      expect(result[2].name).toBe(mockDefinitions[3].name);
    });
  });

  describe('getRawContent', () => {
    it('should return the raw content of a definition', async () => {
      // Arrange
      const id = mockDefinitions[0].id!;

      // Act
      const result = await service.repo.definition.getRawContent(id);

      // Assert
      expect(result).toEqual(mockDefinitionContents[0].content);
    });

    it('should return null if the definition does not exist', async () => {
      // Arrange
      const id = 'nonExistentId';

      // Act
      const result = await service.repo.definition.getRawContent(id);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an error if parameters are not provided', async () => {
      // Arrange
      const id = '';

      // Act
      const result = service.repo.definition.getRawContent(id);

      // Assert
      await expect(result).rejects.toThrow('id is required');
    });
  });

  describe('getBpmnDefinition', () => {
    it('should return the BPMN definition object from a definition', async () => {
      // Arrange
      const id = mockDefinitions[0].id!;

      // Act
      const result = await service.repo.definition.getBpmnDefinition(id);

      // Assert
      expect(result).toEqual(expect.any(Object));
      expect(result).toHaveProperty('bpmn:process');
    });

    it('should return undefined if the definition does not exist', async () => {
      // Arrange
      const id = 'nonExistentId';

      // Act
      const result = await service.repo.definition.getBpmnDefinition(id);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an error if parameters is not provided', async () => {
      // Arrange
      const id = '';

      // Act
      const result = service.repo.definition.getBpmnDefinition(id);

      // Assert
      await expect(result).rejects.toThrow('id is required');
    });
  });

  describe('createDefinition', () => {
    it('should create a new definition', async () => {
      // Arrange
      const data = {
        name: 'Example 5',
        description: 'This is a new example',
        version: '1.0.0',
        content: `
        <bpmn:definitions>
          <bpmn:process id="Process_1igpwhg" isExecutable="false">
              <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
                  <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
              </bpmn:startEvent>
          </bpmn:process>
        </bpmn:definitions>`,
      };

      // Act
      const result = await service.repo.definition.createDefinition(data);

      const def = await k('flowooh_repo_definitions').where('id', result).first();
      const content = await k<FlowoohRepoDefinitionContentData>('flowooh_repo_definition_contents')
        .where('definition_id', def?.id)
        .first();

      // Assert
      expect(def?.name).toEqual(data.name);
      expect(content?.definition_id).toEqual(String(def?.id));
      expect(content?.content).toEqual(data.content);
    });
  });
});
