import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadProjectToCloud, downloadProjectFromCloud } from './services/storageService.js';
import { S3Client, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testAWS() {
    console.log("Starting AWS S3 Integration Test...");
    const testProjectId = "69e304c4733ca5bdc325bb2f"; // Based on your actual local folder

    try {
        console.log("1. Testing Upload Pipeline...");
        await uploadProjectToCloud(testProjectId);
        console.log("Upload passed execution phase. Verifying physically in S3...");

        const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
        const BUCKET = process.env.AWS_S3_BUCKET_NAME;

        await s3.send(new HeadObjectCommand({
            Bucket: BUCKET,
            Key: `projects/${testProjectId}.zip`
        }));
        console.log("✅ SUCCESS: ZIP exists physically inside your AWS Bucket!");

        console.log("\\n2. Testing Download Rehydration Pipeline...");
        const result = await downloadProjectFromCloud(testProjectId);
        
        if (result) {
            console.log("✅ SUCCESS: File successfully dragged down natively from AWS and unzipped over local folder!");
        } else {
            console.error("❌ FAILURE: Download returned false.");
        }

        console.log("\\n3. Cleaning up test artifact...");
        await s3.send(new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: `projects/${testProjectId}.zip`
        }));
        console.log("✅ SUCCESS: Deleted test payload from S3 to save space.");

        console.log("\\n🎉 ALL AWS INTEGRATION TESTS PASSED PERFECTLY!");
    } catch (e) {
        console.error("❌ AWS TEST FAILED:");
        console.error(e.message);
    }
}

testAWS();
