import { BadRequestException } from '@nestjs/common';
import { MongoIdValidationPipe } from '../../../../src/shared/pipes/MongoIdValidationPipe';

describe('MongoIdValidationPipe', () => {
  let pipe: MongoIdValidationPipe;

  beforeEach(() => {
    pipe = new MongoIdValidationPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return valid MongoDB ObjectId', () => {
      const validObjectId = '507f1f77bcf86cd799439011';

      const result = pipe.transform(validObjectId);

      expect(result).toBe(validObjectId);
    });

    it('should return valid MongoDB ObjectId for another format', () => {
      const validObjectId = '507f191e810c19729de860ea';

      const result = pipe.transform(validObjectId);

      expect(result).toBe(validObjectId);
    });

    it('should throw BadRequestException for invalid ObjectId format', () => {
      const invalidObjectId = 'invalid-id';

      expect(() => pipe.transform(invalidObjectId)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(invalidObjectId)).toThrow(
        'Invalid MongoDB ObjectId format: invalid-id',
      );
    });

    it('should throw BadRequestException for empty string', () => {
      const emptyString = '';

      expect(() => pipe.transform(emptyString)).toThrow(BadRequestException);
      expect(() => pipe.transform(emptyString)).toThrow(
        'Invalid MongoDB ObjectId format: ',
      );
    });

    it('should throw BadRequestException for null', () => {
      const nullValue = null as unknown as string;

      expect(() => pipe.transform(nullValue)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for undefined', () => {
      const undefinedValue = undefined as unknown as string;

      expect(() => pipe.transform(undefinedValue)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for too short string', () => {
      const shortString = '123';

      expect(() => pipe.transform(shortString)).toThrow(BadRequestException);
      expect(() => pipe.transform(shortString)).toThrow(
        'Invalid MongoDB ObjectId format: 123',
      );
    });

    it('should throw BadRequestException for too long string', () => {
      const longString = '507f1f77bcf86cd799439011123456789';

      expect(() => pipe.transform(longString)).toThrow(BadRequestException);
      expect(() => pipe.transform(longString)).toThrow(
        'Invalid MongoDB ObjectId format: 507f1f77bcf86cd799439011123456789',
      );
    });

    it('should throw BadRequestException for string with invalid characters', () => {
      const invalidChars = '507f1f77bcf86cd79943901g';

      expect(() => pipe.transform(invalidChars)).toThrow(BadRequestException);
      expect(() => pipe.transform(invalidChars)).toThrow(
        'Invalid MongoDB ObjectId format: 507f1f77bcf86cd79943901g',
      );
    });

    it('should work with different metadata types', () => {
      const validObjectId = '507f1f77bcf86cd799439011';

      expect(pipe.transform(validObjectId)).toBe(validObjectId);
      expect(pipe.transform(validObjectId)).toBe(validObjectId);
    });
  });
});
