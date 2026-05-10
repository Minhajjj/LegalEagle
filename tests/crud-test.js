const { Builder, By, Key, until } = require("selenium-webdriver");
const path = require("path");

async function runLegalEagleTest() {
  // 1. Setup the Chrome browser driver
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // 2. Open your local application
    await driver.get("http://localhost:3000/login");

    // 3. LOG IN (Update these with your actual test account details)
    await driver
      .findElement(By.name("email"))
      .sendKeys("itx.minhaj@gmail.com");
    await driver
      .findElement(By.name("password"))
      .sendKeys("123456", Key.RETURN);

    // 4. READ OPERATION: Wait for Dashboard to load
    // We wait for an element that exists only on your dashboard
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(),'vault')]")),
      10000,
    );
    console.log("SUCCESS: Dashboard 'Read' operation verified.");

    // 5. CREATE OPERATION: Navigate to Upload page
    await driver.get("http://localhost:3000/analyze");

    // 6. UPLOAD FILE: Provide the ABSOLUTE path to your test document
    // Update the path below to where you saved 'Test_Legal_Vault_v1.pdf'
    const filePath = "D:\\DownLoads\\TestDocumentv3.pdf";
    let fileInput = await driver.findElement(By.css('input[type="file"]'));
    await fileInput.sendKeys(filePath);

    // Wait for the 'Start analysis' button to appear and click it
    let startAnalysisBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Start analysis')]")),
      5000
    );
    await startAnalysisBtn.click();

    console.log("SUCCESS: Document 'Create' operation initiated.");

    // 7. Verify redirection to Document Analysis page
    await driver.wait(until.urlContains("/analyze/"), 20000);
    
    // Navigate back to Dashboard to perform Update and Delete
    await driver.get("http://localhost:3000/dashboard");
    
    // Wait for Dashboard to load again
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(),'vault')]")),
      10000,
    );
    await driver.sleep(2000);

    // 8. UPDATE OPERATION (Rename Document)
    console.log("Starting UPDATE operation...");
    
    // Find the document card containing our uploaded file name
    let docCardName = await driver.wait(
      until.elementLocated(By.xpath("//h3[contains(text(), 'TestDocumentv3.pdf')]")),
      10000
    );
    
    // Find the MoreVertical (ellipsis) button on that specific card by going up to the card header
    let ellipsisBtn = await docCardName.findElement(By.xpath("./ancestor::div[contains(@class, 'bg-white')]/descendant::button[contains(@class, 'h-7 w-7')]"));
    await ellipsisBtn.click();
    await driver.sleep(500); // allow animations to settle
    
    // Wait for dropdown menu to appear and click Rename
    let renameOption = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Rename']/..")),
      5000
    );
    await renameOption.click();
    await driver.sleep(500); // allow animations to settle

    // Wait for the modal input and change the name
    let renameInput = await driver.wait(
      until.elementLocated(By.name("rename_input")),
      5000
    );
    
    // Click input, clear it, and type the new name
    const uniqueId = Date.now();
    const uniqueDocName = `Automated_Renamed_Doc_${uniqueId}.pdf`;
    await renameInput.click();
    await renameInput.sendKeys(Key.CONTROL, "a");
    await renameInput.sendKeys(Key.BACK_SPACE);
    await renameInput.sendKeys(uniqueDocName);

    // Click the 'Save changes' button explicitly
    let saveChangesBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Save changes')]")),
      5000
    );
    await driver.sleep(500); // wait for modal animation
    await saveChangesBtn.click();

    // Wait for the rename to process and modal to close
    await driver.wait(
      until.elementLocated(By.xpath(`//h3[contains(text(), '${uniqueDocName}')]`)),
      10000
    );
    console.log("SUCCESS: Document 'Update' (Rename) operation verified.");

    // 9. DELETE OPERATION
    console.log("Starting DELETE operation...");
    await driver.sleep(1000); // slight pause

    // Find the renamed document card
    let renamedDocCardName = await driver.wait(
      until.elementLocated(By.xpath(`//h3[contains(text(), '${uniqueDocName}')]`)),
      5000
    );

    // Find the ellipsis on the renamed card
    let newEllipsisBtn = await renamedDocCardName.findElement(By.xpath("./ancestor::div[contains(@class, 'bg-white')]/descendant::button[contains(@class, 'h-7 w-7')]"));
    await newEllipsisBtn.click();
    await driver.sleep(500);

    // Click Delete from dropdown
    let deleteOption = await driver.wait(
      until.elementLocated(By.xpath("//span[text()='Delete']/..")),
      5000
    );
    await deleteOption.click();
    await driver.sleep(500); // allow animations to settle

    // Wait for Delete Modal and confirm
    let confirmDeleteBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Delete permanently')]")),
      5000
    );
    await driver.sleep(500); // wait for modal animation
    await confirmDeleteBtn.click();

    // Verify document is deleted (wait until the renamed text is stale/removed)
    // We will wait until findElements returns an empty array for this unique name
    await driver.wait(async () => {
      const elements = await driver.findElements(By.xpath(`//h3[contains(text(), '${uniqueDocName}')]`));
      return elements.length === 0;
    }, 15000, "Element was not removed from the dashboard after 15s");
    
    console.log("SUCCESS: Document 'Delete' operation verified.");

    console.log("SUCCESS: All CRUD Operations Complete.");
  } catch (error) {
    console.error("Test Failed:", error);
  } finally {
    // Keep the browser open for 5 seconds so you can see the result, then close
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await driver.quit();
  }
}

runLegalEagleTest();
