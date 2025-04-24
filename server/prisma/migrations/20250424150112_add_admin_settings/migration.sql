-- CreateTable
CREATE TABLE "AdminSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminSetting_pkey" PRIMARY KEY ("id")
);
