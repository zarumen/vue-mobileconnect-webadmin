export const helperTH = {
    // Helper for Campaign Create Fields
    // CampaignField: 'Helper Text Suggestion',
    campaignCode: 'code ของ campaign ที่ใช้เรียกใน บริษัท และจะนำไปใช้เป็น Campaign ID',
    campaignName: 'title ของ campaign',
    campaignDescription: 'description ของ campaign',
    campaignActive: 'set State เริ่มต้นของ campaign',
    campaignAvailable: 'เช็ค ของรางวัลว่ามีอยู่ มั้ย',
    campaignType: 'ประเภทของ campaign',
    campaignSenderName: 'Sender Name ของ campaign',
    campaignDateEnd: 'วันปิด campaign',
    campaignDateStart: 'วันเปิด campaign',
    campaignDateTestEnd: 'วันปิดสถานะ test campaign',
    campaignDateTestStart: 'วันเปิดสถานะ test campaign',
    campaignNotAvailableMsg: 'msg ตอบกลับของรางวัลหมด',
    campaignHasVerifyCode: 'ถ้า campaign ต้อง upload verify_code ของลูกค้ามี 2 แบบคือ รหัสสมาชิก หรือ เบอร์มือถือ contextType ต้องเป็น validate',
    campaignHasMsisdnList: 'verify_code มีเบอร์มือถือเป็นตัวcheck แบบคีย์เดี่ยว { เบอร์โทรศัพท์(ปรับ contextType ให้เป็น regx) } หรือคีย์คู่ { เบอร์โทรศัพท์:รหัสสมาชิก }',
    keyword: 'keywords ของ campaign (เลือกจาก keyword ที่เราได้สร้างจาก shortcode management ใน tab ของ keyword reserved)',
    shortcode: 'shortcode',
    exclude: 'Character ที่ยกเว้น',
    messageContextFailed: 'msg ตอบกลับเมื่อไม่ผ่าน',
    validateFailSpecificMsg: 'msg ตอบกลับเมื่อไม่ผ่าน regex specific นี้',
    validateForm: 'รายละเอียด regex',    
    validateType: 'ประเภทตัวตัด',    
    messageRewardsFailed: 'msg ตอบกลับไม่ได้รับรางวัล',
    messageRewardsInvalid: 'msg ตอบกลับ เมื่อ เช็คของรางวัลไม่เจอ (contextType === reward เท่านั้น)',
    messageRewardReceivedLimit: 'msg ตอบกลับ เมื่อ ของรางวัลหมด (rewardsLimit === 0)',  
    limitReward: 'limit จำนวนของรางวัล',    
    rawLogs: 'เช็คว่า เก็บ raw_logs.xml file หรือไม่',    
    rewardHasSequence: 'รางวัลเป็นแบบ ลำดับหรือไม่',    
    rewardHasObject: 'รางวัลแบบเป็นตัวเลือกต่อท้าย Keyword สำหรับเลือกรางวัล (กรณีผู้ส่งสามารถเลือกรางวัลได้)',    
    coupon: 'เช็คว่ารางวัลนี้ เป็นแบบ coupon หรือไม่',
    rewardId: 'keyเฉพาะรางวัล สำหรับเลือกรางวัล (กรณีผู้ส่งสามารถเลือกรางวัลได้)',  
    name: 'ชื่อของรางวัล',    
    rewardCondition: 'เงื่อนไขการรับรางวัล',    
    rewardTotal: 'จำนวนรางวัล',    
    rewardvalidateForm: 'รายละเอียดของเงื่อนไข (Regex)',    
    contextDelimiter: 'Delimiter = ตัวคั่นระหว่าง context (*, /, $, ...)',    
    contextParserUndefined: 'ไม่มีการตรวจสอบ Context ทั้งหมด (ใช้สำหรับตรวจเบอร์โทรอย่างเดียว + ใส่แค่ keyword)',    
    messageRewardOutOfStock: 'msg ตอบกลับเมื่อของรางวัล หมด',    
    messageRewardSuccess: 'msg ตอบกลับเมื่อชนะเงื่อนไข',    
    messageBoundariesLessError: 'msg ตอบกลับเมื่อข้อมูลไม่ครบ',    
    messageBoundariesOverError: 'msg ตอบกลับเมื่อข้อมูลมากไป',    
    messageAfterEnd: 'msg ตอบกลับเมื่อหมดเวลา ',    
    messageBeforeStart: 'msg ตอบกลับเมื่อเล่นก่อนเวลา',    
    messageCampaignNotAvailable: 'msg ปิดชั่วคราว',    
    messageCampaignTestNotRegister: 'msg ตอบกลับสำหรับเบอร์ที่ ไม่มีสิทธิในการ Test',    
    messageCheckMsisdnNotFound: 'msg ตอบกลับ สำหรับ verifyCode ที่ผูกกับ msisdnList(เบอร์มือถือ) แล้วเจอเบอร์ที่ไม่ใช่สมาชิก',
    messageRegisterFail: 'msg ตอบกลับ เมื่อใช้การลงทะเบียน contextType: register ไปแล้ว',
    messageValidateFail: 'msg ตอบกลับเมื่อไม่ใช่สมาชิก (ต้องมี verifyCode)',
    verifyCodeTestUpload: 'ฟอร์ม upload verifycode สำหรับ TEST',
    verifyCodeProductionUpload: 'ฟอร์ม upload verifycode สำหรับ PRODUCTION',
    couponsTestUpload: 'ฟอร์ม upload coupons สำหรับ TEST',
    couponsProductionUpload: 'ฟอร์ม upload coupons สำหรับ PRODUCTION',
}
