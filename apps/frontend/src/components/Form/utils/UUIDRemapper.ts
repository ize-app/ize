// used to swap out UUIDs during evolve flow
export class UUIDRemapper {
  private uuidMap: Record<string, string>;

  constructor() {
    this.uuidMap = {};
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  // Function to remap an old UUID to a new one
  public remapId(oldUUID: string): string {
    // If the old UUID already exists in the map, return the mapped value
    if (this.uuidMap[oldUUID]) {
      return this.uuidMap[oldUUID];
    }

    // Generate a new UUID
    const newUUID = this.generateUUID();

    // Map the old UUID to the new one
    this.uuidMap[oldUUID] = newUUID;

    // Return the new UUID
    return newUUID;
  }

  // Function to get the new UUID for a given old UUID
  public getRemappedUUID(oldUUID: string): string {
    const newUUID = this.uuidMap[oldUUID];
    if (!newUUID) "Remapped UUID not found for " + oldUUID;
    return newUUID;
  }
}
