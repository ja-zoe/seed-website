import { db } from '../db/connection';
import { projectProposals, type NewProjectProposal, type ProjectProposal } from '../db/schema';
import { desc, ilike, or, sql } from 'drizzle-orm';

export class ProposalService {
  /**
   * Create a new project proposal
   */
  static async createProposal(proposalData: Omit<NewProjectProposal, 'id' | 'submittedAt'>): Promise<ProjectProposal> {
    const [proposal] = await db
      .insert(projectProposals)
      .values(proposalData)
      .returning();
    
    return proposal;
  }

  /**
   * Get all project proposals with optional search
   */
  static async getProposals(searchTerm?: string): Promise<ProjectProposal[]> {
    let query = db.select().from(projectProposals);

    if (searchTerm) {
      // Search in leads' names and emails, problem statement, and objectives
      query = query.where(
        or(
          sql`${projectProposals.leads}::text ILIKE ${`%${searchTerm}%`}`,
          sql`${projectProposals.problemStatement}::text ILIKE ${`%${searchTerm}%`}`,
          sql`${projectProposals.objectives}::text ILIKE ${`%${searchTerm}%`}`,
          sql`${projectProposals.goal}::text ILIKE ${`%${searchTerm}%`}`
        )
      );
    }

    return await query.orderBy(desc(projectProposals.submittedAt));
  }

  /**
   * Get a single proposal by ID
   */
  static async getProposalById(id: number): Promise<ProjectProposal | null> {
    const [proposal] = await db
      .select()
      .from(projectProposals)
      .where(sql`${projectProposals.id} = ${id}`)
      .limit(1);

    return proposal || null;
  }

  /**
   * Delete a proposal by ID
   */
  static async deleteProposal(id: number): Promise<boolean> {
    const result = await db
      .delete(projectProposals)
      .where(sql`${projectProposals.id} = ${id}`);

    return result.rowCount > 0;
  }

  /**
   * Get proposal statistics
   */
  static async getStatistics() {
    const [totalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectProposals);

    const [recentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectProposals)
      .where(sql`${projectProposals.submittedAt} >= NOW() - INTERVAL '30 days'`);

    return {
      total: totalCount.count,
      recent: recentCount.count,
    };
  }
}