-- Digital Vehicle Inspection (DVI) database setup
-- This script contains schema changes and stored procedures assumed by the backend

-- 1. Ensure the MECHANIC table has a MobileEnabled column
--    Used by the API when listing/login mechanics.
IF COL_LENGTH('MECHANIC', 'MobileEnabled') IS NULL
BEGIN
    ALTER TABLE MECHANIC ADD MobileEnabled BIT NOT NULL DEFAULT 0;
END;
GO

-- 2. Stored procedure to return mobile-enabled mechanics for a given HOME_SHOP
--    Utilized by backend/services to populate login and selection lists.
CREATE OR ALTER PROCEDURE GetMobileMechanicsByShop
    @ShopId INT
AS
BEGIN
    SELECT MECHANIC_NUMBER,
           MECHANIC_NAME,
           POPUP_TYPE
    FROM MECHANIC
    WHERE HOME_SHOP = @ShopId
      AND MobileEnabled = 1
      AND ISNULL(POPUP_TYPE, '') <> ''
      AND UPPER(CERTIFICATE_NUMBER) <> 'EXPIRED';
END;
GO

-- Recommended indexes (uncomment to create once reviewed)
-- CREATE INDEX IX_Mechanic_Shop_Mobile ON MECHANIC (HOME_SHOP, MobileEnabled);
-- CREATE INDEX IX_Mechanic_Number ON MECHANIC (MECHANIC_NUMBER);

