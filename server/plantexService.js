
export default class PlantexService {

  constructor(pool) {
    this.databaseConector = pool;
  }

  async createLog(googleDriverLink, downloadLink) {
    try {
      const query = `
        INSERT INTO scheduled_photos (google_drive_link, google_drive_download_link, name)
        VALUES ($1, $2, $3)
      `;
      const values = [googleDriverLink, downloadLink, "image-test-before-launch"];
      await this.databaseConector.query(query, values);
      return true;
    } catch (error) {
      console.log('Error creating log:', error);
      return false;
    }
  }


  async findPhotos(lastId, limit, startDate, endDate) {
    try {
      if (Number.isNaN(lastId) || Number.isNaN(limit)) {
        throw new Error('Invalid parameters');
      }
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = startDate && endDate ? `AND created_at BETWEEN '${startDate}' AND '${endDate}'` : '';
      } else if (startDate) {
        dateFilter = `AND created_at >= '${startDate}'`;
      } else if (endDate) {
        dateFilter = `AND created_at <= '${endDate}'`;
      }


      const query = `
        SELECT google_drive_link AS googleDriveLink, google_drive_download_link AS googleDriveDownloadLink, id, created_at as date  FROM scheduled_photos
        WHERE id > $1
        ${dateFilter}
        ORDER BY id ASC
        LIMIT $2
      `;
      const queryCount = `
        SELECT COUNT(*) FROM scheduled_photos
      `;
      const values = [lastId * limit, limit];
      const [result, count] = await Promise.all([
        this.databaseConector.query(query, values),
        this.databaseConector.query(queryCount)
      ]);
      return {
        photos: result.rows,
        total: count.rows[0].count,
        page: lastId,
      };
    } catch (error) {
      console.log('Error finding photos:', error);
      return [];
    }
  }
}