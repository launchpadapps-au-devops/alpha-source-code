import { MigrationInterface, QueryRunner } from "typeorm";

export class EventListener_On_Notification_Table20240628T100201Z implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the function to handle notifications
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION notify_new_notification() RETURNS trigger AS $$
      BEGIN
        PERFORM pg_notify('new_notification', row_to_json(NEW)::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create the trigger on the notifications table
    await queryRunner.query(`
      CREATE OR REPLACE TRIGGER new_notification_trigger
      AFTER INSERT ON notifications
      FOR EACH ROW EXECUTE FUNCTION notify_new_notification();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the trigger
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS new_notification_trigger ON notifications;
    `);

    // Drop the function
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS notify_new_notification;
    `);
  }
}
