import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

export async function migrateDates() {
  await dbConnect();

  console.log('🔄 Starting date migration...');

  const articles = await Article.find({});

  let updatedCount = 0;
  
  for (const article of articles) {
    if (article.publishDate) {
      const newDate = new Date(article.publishDate);

      // Ensure the date is valid before updating
      if (!isNaN(newDate.getTime())) {
        await Article.updateOne(
          { _id: article._id },
          { $set: { publishDate: newDate } }
        );
        updatedCount++;
      } else {
        console.error(`❌ Invalid date for article ${article._id}: ${article.publishDate}`);
      }
    }
  }

  console.log(`✅ Migration completed. Updated ${updatedCount} articles.`);
  // process.exit();
}