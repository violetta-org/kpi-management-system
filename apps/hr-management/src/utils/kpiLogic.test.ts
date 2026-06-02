import { describe, it, expect } from 'vitest';
import { calculateKpiAchievementRate } from './kpiLogic';

describe('calculateKpiAchievementRate', () => {

  describe('Direction 1: Tối đa hóa (Higher is better)', () => {
    it('Nên trả về đúng % khi đạt mục tiêu cơ bản', () => {
      expect(calculateKpiAchievementRate(100, 80, 1)).toBe(80);
      expect(calculateKpiAchievementRate(100, 100, 1)).toBe(100);
    });

    it('Nên hỗ trợ tính điểm vượt mức 100% (Overachievement)', () => {
      expect(calculateKpiAchievementRate(100, 150, 1)).toBe(150);
      expect(calculateKpiAchievementRate(50, 60, 1)).toBe(120);
    });

    it('Nên xử lý các mục tiêu = 0 một cách an toàn', () => {
      expect(calculateKpiAchievementRate(0, 0, 1)).toBe(100);
      expect(calculateKpiAchievementRate(0, 10, 1)).toBe(100); // Đã vượt qua mục tiêu 0
      expect(calculateKpiAchievementRate(-5, -2, 1)).toBe(100); // -2 lớn hơn -5
      expect(calculateKpiAchievementRate(-5, -10, 1)).toBe(0); // -10 kém hơn -5
    });
  });

  describe('Direction 2: Tối thiểu hóa (Lower is better)', () => {
    it('Nên trả về 100% nếu thực tế thấp hơn hoặc bằng mục tiêu', () => {
      expect(calculateKpiAchievementRate(10, 8, 2)).toBe(100);
      expect(calculateKpiAchievementRate(10, 10, 2)).toBe(100);
    });

    it('Nên trừ điểm tương ứng nếu thực tế cao hơn mục tiêu', () => {
      // Công thức: (2 - 12/10) * 100 = (2 - 1.2) * 100 = 80%
      expect(calculateKpiAchievementRate(10, 12, 2)).toBe(80);
      
      // Công thức: (2 - 15/10) * 100 = (2 - 1.5) * 100 = 50%
      expect(calculateKpiAchievementRate(10, 15, 2)).toBe(50);
      
      // Công thức: (2 - 20/10) * 100 = (2 - 2) * 100 = 0%
      expect(calculateKpiAchievementRate(10, 20, 2)).toBe(0);
    });

    it('Nên không cho điểm âm khi thực tế quá cao', () => {
      expect(calculateKpiAchievementRate(10, 30, 2)).toBe(0); // Sẽ là -100 nếu không có Math.max(0, ...)
    });

    it('Nên xử lý an toàn mục tiêu = 0 (VD: Mục tiêu 0 lỗi bug)', () => {
      expect(calculateKpiAchievementRate(0, 0, 2)).toBe(100); // Đạt 0 lỗi -> 100%
      expect(calculateKpiAchievementRate(0, 2, 2)).toBe(0);   // Có 2 lỗi (kém hơn mục tiêu 0) -> 0%
      expect(calculateKpiAchievementRate(-2, 0, 2)).toBe(0);  // Kém hơn mục tiêu âm
    });
  });

  describe('Direction 3 & 4: Nhị phân và Cột mốc (Binary / Milestone)', () => {
    it('Nên trả về 100% nếu đạt hoặc vượt chỉ tiêu', () => {
      expect(calculateKpiAchievementRate(1, 1, 3)).toBe(100);
      expect(calculateKpiAchievementRate(10, 15, 4)).toBe(100);
    });

    it('Nên trả về 0% nếu không đạt chỉ tiêu', () => {
      expect(calculateKpiAchievementRate(1, 0, 3)).toBe(0);
      expect(calculateKpiAchievementRate(10, 9, 4)).toBe(0);
    });
  });

});
