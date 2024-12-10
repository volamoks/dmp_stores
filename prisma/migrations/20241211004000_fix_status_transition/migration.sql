-- First, alter the status column to text while preserving the values
ALTER TABLE "zones" ALTER COLUMN status TYPE text;

-- Now we can safely drop the enum
DROP TYPE IF EXISTS "Status";

-- Finally drop the status column as we'll handle it in application logic
ALTER TABLE "zones" DROP COLUMN status;
