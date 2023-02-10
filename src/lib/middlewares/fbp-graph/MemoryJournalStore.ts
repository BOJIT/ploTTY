import JournalStore from './JournalStore';
import { Graph } from './Graph';
import type { TransactionEntry } from './Types';

/**
 * In-memory journal storage
 *
 */
export default class MemoryJournalStore extends JournalStore {
  transactions: Array<Array<TransactionEntry>>
  constructor(graph: Graph) {
    super(graph);
    this.transactions = [];
  }

  countTransactions(): number {
    return this.transactions.length;
  }

  putTransaction(revId: number, entries: Array<TransactionEntry>) {
    super.putTransaction(revId, entries);
    this.transactions[revId] = entries;
  }

  fetchTransaction(revId: number): Array<TransactionEntry> {
    return this.transactions[revId];
  }
}
