-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'FAILED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileImage" TEXT,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "totalCoins" INTEGER NOT NULL DEFAULT 0,
    "referralCode" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topic_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rewardCoins" INTEGER NOT NULL,
    "questions" JSONB[],
    "correctAnswers" INTEGER[],
    "timeLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "quiz_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "reading_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoDuration" INTEGER NOT NULL,
    "rewardCoins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "video_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "true_false_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB[],
    "correctAnswers" BOOLEAN[],
    "rewardCoins" INTEGER NOT NULL,
    "timeLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "true_false_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spin_rewards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rewardCoins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spin_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_item_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchange_item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "coinPrice" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "exchange_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "quizStatus" "TaskStatus" NOT NULL,
    "quizStartTime" TIMESTAMP(3),
    "readingStatus" "TaskStatus" NOT NULL,
    "readingStartTime" TIMESTAMP(3),
    "trueFalseStatus" "TaskStatus" NOT NULL,
    "trueFalseStartTime" TIMESTAMP(3),
    "videoStatus" "TaskStatus" NOT NULL,
    "videoStartTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_referralCode_idx" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "topic_categories_name_key" ON "topic_categories"("name");

-- CreateIndex
CREATE INDEX "topic_categories_name_idx" ON "topic_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topics_title_key" ON "Topics"("title");

-- CreateIndex
CREATE INDEX "Topics_title_idx" ON "Topics"("title");

-- CreateIndex
CREATE INDEX "Topics_categoryId_idx" ON "Topics"("categoryId");

-- CreateIndex
CREATE INDEX "Topics_createdAt_idx" ON "Topics"("createdAt");

-- CreateIndex
CREATE INDEX "quiz_tasks_title_idx" ON "quiz_tasks"("title");

-- CreateIndex
CREATE INDEX "quiz_tasks_rewardCoins_idx" ON "quiz_tasks"("rewardCoins");

-- CreateIndex
CREATE INDEX "quiz_tasks_topicId_idx" ON "quiz_tasks"("topicId");

-- CreateIndex
CREATE INDEX "quiz_tasks_createdAt_idx" ON "quiz_tasks"("createdAt");

-- CreateIndex
CREATE INDEX "reading_tasks_title_idx" ON "reading_tasks"("title");

-- CreateIndex
CREATE INDEX "reading_tasks_rewardCoins_idx" ON "reading_tasks"("rewardCoins");

-- CreateIndex
CREATE INDEX "reading_tasks_topicId_idx" ON "reading_tasks"("topicId");

-- CreateIndex
CREATE INDEX "reading_tasks_createdAt_idx" ON "reading_tasks"("createdAt");

-- CreateIndex
CREATE INDEX "video_tasks_title_idx" ON "video_tasks"("title");

-- CreateIndex
CREATE INDEX "video_tasks_rewardCoins_idx" ON "video_tasks"("rewardCoins");

-- CreateIndex
CREATE INDEX "video_tasks_topicId_idx" ON "video_tasks"("topicId");

-- CreateIndex
CREATE INDEX "video_tasks_createdAt_idx" ON "video_tasks"("createdAt");

-- CreateIndex
CREATE INDEX "true_false_tasks_title_idx" ON "true_false_tasks"("title");

-- CreateIndex
CREATE INDEX "true_false_tasks_rewardCoins_idx" ON "true_false_tasks"("rewardCoins");

-- CreateIndex
CREATE INDEX "true_false_tasks_topicId_idx" ON "true_false_tasks"("topicId");

-- CreateIndex
CREATE INDEX "true_false_tasks_createdAt_idx" ON "true_false_tasks"("createdAt");

-- CreateIndex
CREATE INDEX "spin_rewards_rewardCoins_idx" ON "spin_rewards"("rewardCoins");

-- CreateIndex
CREATE INDEX "spin_rewards_createdAt_idx" ON "spin_rewards"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_item_categories_name_key" ON "exchange_item_categories"("name");

-- CreateIndex
CREATE INDEX "exchange_item_categories_name_idx" ON "exchange_item_categories"("name");

-- CreateIndex
CREATE INDEX "exchange_items_coinPrice_idx" ON "exchange_items"("coinPrice");

-- CreateIndex
CREATE INDEX "exchange_items_title_idx" ON "exchange_items"("title");

-- CreateIndex
CREATE INDEX "exchange_items_categoryId_idx" ON "exchange_items"("categoryId");

-- CreateIndex
CREATE INDEX "exchange_items_createdAt_idx" ON "exchange_items"("createdAt");

-- CreateIndex
CREATE INDEX "purchases_userId_idx" ON "purchases"("userId");

-- CreateIndex
CREATE INDEX "purchases_itemId_idx" ON "purchases"("itemId");

-- CreateIndex
CREATE INDEX "purchases_createdAt_idx" ON "purchases"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isChecked_idx" ON "notifications"("isChecked");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "user_tasks_userId_idx" ON "user_tasks"("userId");

-- CreateIndex
CREATE INDEX "user_tasks_topicId_idx" ON "user_tasks"("topicId");

-- CreateIndex
CREATE INDEX "user_tasks_createdAt_idx" ON "user_tasks"("createdAt");

-- CreateIndex
CREATE INDEX "user_tasks_quizStatus_quizStartTime_idx" ON "user_tasks"("quizStatus", "quizStartTime");

-- CreateIndex
CREATE INDEX "user_tasks_readingStatus_readingStartTime_idx" ON "user_tasks"("readingStatus", "readingStartTime");

-- CreateIndex
CREATE INDEX "user_tasks_trueFalseStatus_trueFalseStartTime_idx" ON "user_tasks"("trueFalseStatus", "trueFalseStartTime");

-- CreateIndex
CREATE INDEX "user_tasks_videoStatus_videoStartTime_idx" ON "user_tasks"("videoStatus", "videoStartTime");

-- CreateIndex
CREATE INDEX "user_tasks_userId_topicId_idx" ON "user_tasks"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "Topics" ADD CONSTRAINT "Topics_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "topic_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_tasks" ADD CONSTRAINT "quiz_tasks_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_tasks" ADD CONSTRAINT "reading_tasks_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_tasks" ADD CONSTRAINT "video_tasks_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "true_false_tasks" ADD CONSTRAINT "true_false_tasks_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_items" ADD CONSTRAINT "exchange_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "exchange_item_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "exchange_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
