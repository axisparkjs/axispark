import { ClassType } from '@axisparkjs/common';
import { ObjectLiteral } from 'typeorm';
import { RepositoryDefinition } from './repository-definition';

class TestEntity implements ObjectLiteral {
    [key: string]: any;
    id = 1;
}

class TestRepository {}

describe('RepositoryDefinition', () => {
    it('stores repository target, entity, data source name, and implementation', () => {
        const implementation = { findById: jest.fn() };
        const definition = new RepositoryDefinition(TestRepository as ClassType, TestEntity as ClassType<TestEntity>, 'primary', implementation);

        expect(definition.target).toBe(TestRepository);
        expect(definition.entity).toBe(TestEntity);
        expect(definition.dataSourceName).toBe('primary');
        expect(definition.implementation).toBe(implementation);
    });
});
