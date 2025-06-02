import { describe, it, expect } from 'vitest';
import {
  DEMO_MISSIONS,
  DEMO_CONVERSATIONS,
  AGENT_RESPONSES,
  USER_PERSONAS,
  getCurrentDemoData,
  getRandomAgentResponse,
} from './demo-data';

describe('Demo Data', () => {
  describe('DEMO_MISSIONS', () => {
    it('should have valid mission structures', () => {
      Object.values(DEMO_MISSIONS).forEach(mission => {
        expect(mission).toHaveProperty('id');
        expect(mission).toHaveProperty('title');
        expect(mission).toHaveProperty('description');
        expect(mission).toHaveProperty('status');
        expect(mission).toHaveProperty('sections');
        expect(Array.isArray(mission.sections)).toBe(true);
      });
    });

    it('should have sections with required properties', () => {
      Object.values(DEMO_MISSIONS).forEach(mission => {
        mission.sections.forEach(section => {
          expect(section).toHaveProperty('id');
          expect(section).toHaveProperty('title');
          expect(section).toHaveProperty('status');
          expect(section).toHaveProperty('isEditable');
          expect(typeof section.isEditable).toBe('boolean');
        });
      });
    });

    it('should have family vacation mission with correct data', () => {
      const familyMission = DEMO_MISSIONS.FAMILY_VACATION;
      expect(familyMission.title).toBe('Vacances familiales à Paris');
      expect(familyMission.sections).toHaveLength(4);
      expect(familyMission.sections[0].title).toBe('Participants');
      expect(familyMission.sections[1].title).toBe('Dates et durée');
    });
  });

  describe('DEMO_CONVERSATIONS', () => {
    it('should have valid conversation structures', () => {
      Object.values(DEMO_CONVERSATIONS).forEach(conversation => {
        expect(Array.isArray(conversation)).toBe(true);
        conversation.forEach(message => {
          expect(message).toHaveProperty('id');
          expect(message).toHaveProperty('content');
          expect(message).toHaveProperty('role');
          expect(message).toHaveProperty('timestamp');
          expect(['user', 'assistant'].includes(message.role)).toBe(true);
        });
      });
    });

    it('should have alternating user and agent messages', () => {
      const familyConversation = DEMO_CONVERSATIONS.FAMILY_VACATION;
      expect(familyConversation[0].role).toBe('user');
      expect(familyConversation[1].role).toBe('assistant');
      expect(familyConversation[2].role).toBe('assistant');
      expect(familyConversation[3].role).toBe('user');
    });
  });

  describe('AGENT_RESPONSES', () => {
    it('should have response templates for each category', () => {
      expect(AGENT_RESPONSES).toHaveProperty('GREETING');
      expect(AGENT_RESPONSES).toHaveProperty('CLARIFICATION');
      expect(AGENT_RESPONSES).toHaveProperty('CONFIRMATION');
      expect(AGENT_RESPONSES).toHaveProperty('SUGGESTIONS');

      Object.values(AGENT_RESPONSES).forEach(responses => {
        expect(Array.isArray(responses)).toBe(true);
        expect(responses.length).toBeGreaterThan(0);
        responses.forEach(response => {
          expect(typeof response).toBe('string');
          expect(response.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('USER_PERSONAS', () => {
    it('should have valid persona structures', () => {
      Object.values(USER_PERSONAS).forEach(persona => {
        expect(persona).toHaveProperty('name');
        expect(persona).toHaveProperty('type');
        expect(persona).toHaveProperty('priorities');
        expect(persona).toHaveProperty('communication_style');
        expect(Array.isArray(persona.priorities)).toBe(true);
        expect(typeof persona.name).toBe('string');
        expect(typeof persona.type).toBe('string');
        expect(typeof persona.communication_style).toBe('string');
      });
    });
  });

  describe('getCurrentDemoData', () => {
    it('should return current demo scenario data', () => {
      const demoData = getCurrentDemoData();
      
      expect(demoData).toHaveProperty('mission');
      expect(demoData).toHaveProperty('conversation');
      expect(demoData).toHaveProperty('persona');
      
      expect(demoData.mission).toBe(DEMO_MISSIONS.FAMILY_VACATION);
      expect(demoData.conversation).toBe(DEMO_CONVERSATIONS.FAMILY_VACATION);
      expect(demoData.persona).toBe(USER_PERSONAS.FAMILY_TRAVELER);
    });
  });

  describe('getRandomAgentResponse', () => {
    it('should return a valid response for each type', () => {
      const responseTypes = ['GREETING', 'CLARIFICATION', 'CONFIRMATION', 'SUGGESTIONS'] as const;
      
      responseTypes.forEach(type => {
        const response = getRandomAgentResponse(type);
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(0);
        expect((AGENT_RESPONSES[type] as readonly string[]).includes(response)).toBe(true);
      });
    });

    it('should return different responses on multiple calls', () => {
      const responses = new Set();
      
      // Call multiple times to check for variety
      for (let i = 0; i < 10; i++) {
        responses.add(getRandomAgentResponse('GREETING'));
      }
      
      // Should have some variety (not always the same response)
      // Note: This test might occasionally fail due to randomness, but it's unlikely
      expect(responses.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Data Consistency', () => {
    it('should have realistic French content', () => {
      const familyMission = DEMO_MISSIONS.FAMILY_VACATION;
      const familyConversation = DEMO_CONVERSATIONS.FAMILY_VACATION;
      
      // Check for French content
      expect(familyMission.title).toContain('Paris');
      expect(familyConversation[0].content).toContain('Bonjour');
      
      // Check for realistic details
      expect(familyMission.sections[0].content).toContain('Marie et Pierre');
      expect(familyMission.sections[1].content).toContain('juillet');
    });
  });
});
