<script>
const appConfig = require('@/app.config')

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { 
    Layout: () => import('@layouts/main')
  },
  data: () => ({
    image: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2Fmoblie-slider1.jpg?alt=media&token=565426b8-16de-4179-8532-2f7c6b7bcd98',
    image2: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2Fmoblie-slider3.jpg?alt=media&token=6f91507f-35b6-4bf2-9425-778b670d7ca2',
    sp01: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2waysp01_s.jpg?alt=media&token=7a9a499d-47ca-48f0-b241-0934168e6061',
    sp03: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2waysp03_s.jpg?alt=media&token=484a8cb5-9e5c-48ed-bc00-dafbdb2516a6',
    sp05: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2waysp05s.jpg?alt=media&token=8d7e2928-1ec2-4b80-a7b9-6bcfb20f964f',
    sp06: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2waysp06_s.jpg?alt=media&token=d44daf2b-9e9c-45d8-b771-07bec604ee60',
    sp07: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2waysp07_s.jpg?alt=media&token=91595ab5-60e9-434e-aed0-5b539ccbd8a8',
    sp08: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2waysp08_s.jpg?alt=media&token=499481e7-200c-4c7c-8067-f60961f48200',
  }),
  created () {
  }
}
</script>

<template>
  <Layout>
    <div>
      <section>
        <v-parallax
          :src="`${image}`"
          :gradient="`to top, rgba(13, 3, 29, .85), rgba(25, 25, 38, .85)`"
          height="800"
          style="top: -80px;"
        >
          <v-layout
            column
            align-center
            justify-center
            class="white--text"
          >
            <img
              src="@assets/images/mc-logo.png"
              alt="Mobile Connect"
              height="200"
            >
            <div 
              id="fontTitle" 
              class="white--text mb-1 text-center" 
              style="font-size: 40px;"
            >
              Mobile Connect
            </div>
            <!--               <div class="subheading mb-3 text-center">by Mobile Connect</div> -->
            <base-button
              class="green mt-5"
              dark
              large
              rounded
              to="/profile"
            >
              เข้าสู่โปรแกรม
            </base-button>
          </v-layout>
        </v-parallax>
      </section>
      <section>
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex
            xs12
            md8
            sm4
            class="my-3"
            align-center
          >
            <v-container>
              <v-layout
                row
                wrap
                align-center
              >
                <v-flex
                  xs12
                  pa-2
                >
                  <v-card 
                    color="transparent" 
                    flat
                  >
                    <v-flex class="blue--text display-1 text-center pa-5">
                      2 Ways SMS Solution
                    </v-flex>
                    <v-flex class="text-left px-5">
                      ให้คำปรึกษาและให้บริการเกี่ยวกับ “กิจกรรมการตลาดผ่าน SMS” ในรูปแบบของ 2WAYS SMS อย่างมืออาชีพ มากกว่า 800 แคมเปญต่อปี ที่เราได้ให้บริการอย่างมีประสิทธิภาพ<br>
                      เหมาะสำหรับกิจกรรม<br><br>
                      <v-flex class="pl-5 pb-5">
                        <v-icon>check_box</v-icon> โหวต <br>
                        <v-icon>check_box</v-icon> ตอบคำถาม<br>
                        <v-icon>check_box</v-icon> ผลสำรวจ<br>
                        <v-icon>check_box</v-icon> ชิงรางวัล<br>
                        <v-icon>check_box</v-icon> ลงทะเบียน<br>
                        <v-icon>check_box</v-icon> เช็คยอดคะแนนสะสม
                      </v-flex>
                    </v-flex>
                  </v-card>
                  <p />
                  <v-card 
                    color="transparent" 
                    flat
                  >
                    <v-flex class="blue--text display-1 text-center pa-5">
                      2WAYS SMS
                    </v-flex>
                    <div class="thai18 text-left px-5 pb-5">
                      &nbsp;&nbsp;&nbsp;&nbsp;คือกิจกรรมการตลาดผ่านทางโทรศัพท์มือถือ สามารถนำมาประยุกต์ใช้ได้กับหลากหลายธุรกิจ สร้างการสื่อสารแบบ SMS Interactive กับกลุ่มเป้าหมาย <br>ช่วยเพิ่มกลุ่มลูกค้าใหม่ รักษาฐานลูกค้าเก่า (Acquire or Retain Customer), สร้างการรับรู้ผลิตภัณฑ์ (Brand Awareness) และเพิ่มรายได้ (Generate Revenue) สร้างความสัมพันธ์ที่ดีระหว่างลูกค้ากับองค์กร
                    </div>
                  </v-card>
                </v-flex>  
              </v-layout>
            </v-container>
          </v-flex> 
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout
                row
                wrap
                align-center
              >
                <v-flex
                  xs12
                  md4
                >
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-center">
                      <v-icon
                        x-large
                        class="blue--text text--lighten-2"
                      >
                        color_lens
                      </v-icon>
                    </v-card-text>
                    <v-card-title
                      primary-title
                      class="layout justify-center"
                    >
                      <div class="headline-normal text-center">
                        สร้างสีสันทางการตลาด
                      </div>
                    </v-card-title>
                    <v-card-text>
                      เพิ่มลูกเล่นใหม่ที่ไม่ซ้ำใคร นำมาประยุกต์ใช้ให้เข้ากับธุรกิจที่มีหลากหลายรูปแบบ สร้างภาพลักษณ์ให้ดูทันสมัย ยืดหยุ่นและปรับลูกเล่นให้เหมาะสมตาม Concept ที่ต้องการได้
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex
                  xs12
                  md4
                >
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-center">
                      <v-icon
                        x-large
                        class="blue--text text--lighten-2"
                      >
                        flash_on
                      </v-icon>
                    </v-card-text>
                    <v-card-title
                      primary-title
                      class="layout justify-center"
                    >
                      <div class="headline-normal">
                        กระตุ้นยอดขาย
                      </div>
                    </v-card-title>
                    <v-card-text>
                      ด้วยวิธีการที่ง่ายและน่าสนใจ ทำให้กลุ่มเป้าหมาย มีความพอใจในการร่วมกิจกรรมสูง เกิดการกระตุ้น Brand Loyalty มากขึ้น สามารถวัดผลได้ว่าแคมเปญมีประสิทธิภาพเพียงใด ประหยัดเวลาและลดความยุ่งยากในการจัดแคมเปญ
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex
                  xs12
                  md4
                >
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-center">
                      <v-icon
                        x-large
                        class="blue--text text--lighten-2"
                      >
                        build
                      </v-icon>
                    </v-card-text>
                    <v-card-title
                      primary-title
                      class="layout justify-center"
                    >
                      <div class="headline-normal text-center">
                        รักษาลูกค้าเก่า-เพิ่มลูกค้าใหม่
                      </div>
                    </v-card-title>
                    <v-card-text>
                      สามารถเข้าถึงกลุ่มคนทุกเพศ ทุกวัย ทุกสายอาชีพ ช่วยรักษากลุ่มลูกค้าเก่า-ขยายกลุ่มลูกค้าใหม่ได้ อีกทั้งยังช่วยเก็บข้อมูลเพื่อวิจัยตลาด ทำให้รับรู้ถึงพฤติกรรมและความต้องการของลูกค้า แล้วนำมาพัฒนาสินค้าและบริการในครั้งต่อ ๆ ไป
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>
      <section>
        <v-container 
          fluid 
          grid-list-sm
        >
          <v-layout>
            <v-flex 
              xs12 
            >
              <v-img
                src="https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2F2way_pic01.jpg?alt=media&token=c8429ae1-e344-40f0-9ae7-2a31077453b3"
              />
            </v-flex>
          </v-layout>
        </v-container>              
      </section>
      <section>
        <v-container>
          <v-layout
            column
            wrap
            class="my-5"
            align-center
          >
            <v-flex
              xs12
              md8
              sm4
              class="my-3"
            >
              <div class="text-center">
                <h2 class="headline-normal">
                  ตัวอย่างแคมเปญ 2WAYS SMS
                </h2>
                <!--                 <span class="subheading">
                  จากองค์กรและแบรนด์สินค้าดัง ที่เราได้รับความไว้วางใจให้บริการ
                </span> -->
              </div>
              <div class="thai18 mb-3 text-left ">
                จากองค์กรและแบรนด์สินค้าดัง ที่เราได้รับความไว้วางใจให้บริการ
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout
              row
              wrap
              align-center
            >
              <v-flex 
                xs12
                sm6
                md4
              >
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    raised
                    ripple
                  >
                    <v-img :src="sp01">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out green darken-2 display-3 white--text"
                          style="align-items: center; justify-content: center; height: 100%; opacity: .7;"
                        >
                          ชิงโชค ชิงรางวัล
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-flex>
              <v-flex 
                xs12
                sm6
                md4
              >
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    raised
                    ripple
                  >
                    <v-img :src="sp08">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out green darken-2 display-3 white--text"
                          style="align-items: center; justify-content: center; height: 100%; opacity: .7;"
                        >
                          รับส่วนลด
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-flex>

              <v-flex 
                xs12
                sm6
                md4
              >
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    raised
                    ripple
                  >
                    <v-img :src="sp03">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out green darken-2 display-3 white--text"
                          style="align-items: center; justify-content: center; height: 100%; opacity: .7;"
                        >
                          ชิงโชคใบเสร็จ
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-flex>
              <v-flex 
                xs12
                sm6
                md4
              >
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    raised
                    ripple
                  >
                    <v-img :src="sp07">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out green darken-2 display-3 white--text"
                          style="align-items: center; justify-content: center; height: 100%; opacity: .7;"
                        >
                          ลงทะเบียน
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-flex>

              <v-flex 
                xs12
                sm6
                md4
              >
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    raised
                    ripple
                  >
                    <v-img :src="sp06">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out green darken-2 display-3 white--text"
                          style="align-items: center; justify-content: center; height: 100%; opacity: .7;"
                        >
                          ส่ง SMS
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-flex>

              <v-flex 
                xs12
                sm6
                md4
              >
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${hover ? 12 : 2}`"
                    raised
                    ripple
                  >
                    <v-img :src="sp05">
                      <v-expand-transition>
                        <div
                          v-if="hover"
                          class="d-flex transition-fast-in-fast-out green darken-2 display-3 white--text"
                          style="align-items: center; justify-content: center; height: 100%; opacity: .7;"
                        >
                          ส่ง USSD
                        </div>
                      </v-expand-transition>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-flex>
            </v-layout>  
          </v-container>
        </v-flex>       
      </section>         
      <section>
        <v-parallax
          :src="image2"
          height="380"
        >
          <v-layout
            column
            align-center
            justify-center
          >
            <div class="headline-white mb-3 text-center">
              หากสนใจและต้องการสอบถามข้อมูลเพิ่มเติม ติดต่อฝ่ายขาย
            </div>
            <em>One Stop Service : เราคือ ผู้นำด้านให้บริการ 2Ways SMS ที่ดีที่สุด</em>
            <base-button
              class="green darken-2 mt-5"
              dark
              large
              rounded
              href="tel:+66658958328"
            >
              TEL. 06-5895-8328
            </base-button>
          </v-layout>
        </v-parallax>
      </section>
      <section>
        <v-container grid-list-xl>
          <v-layout
            row
            wrap
            justify-center
            class="my-5"
          >
            <v-flex
              xs12
              sm4
            >
              <v-card class="elevation-0 transparent">
                <v-card-title
                  primary-title
                  class="layout justify-center"
                >
                  <div class="headline">
                    Company info
                  </div>
                </v-card-title>
                <v-card-text>
                  บริษัท โมบาย คอนเน็ค จำกัด เป็นผู้ให้บริการ Mobile Marketing & CRM แบบครบวงจร ด้วยทีมงานที่มีความเชี่ยวชาญ <br>และมีประสบการณ์ให้บริการแก่องค์กรชั้นนำต่าง ๆ ทั้งในประเทศไทย <br>และต่างประเทศ การันตีจากประสบการณ์ 18 ปี

                  <p />
                  <v-card-actions>
                    <v-flex class="layout justify-center">
                      <a href="https://www.facebook.com/MC.MobileConnect/">
                        <img src="https://img.icons8.com/color/48/000000/facebook-new.png">
                      </a>
                      <a href="http://line.me/R/ti/p/%40mobileconnect">
                        <img src="https://img.icons8.com/color/48/000000/line-me.png">
                      </a>
                      <a href="http://mobileconnect.co.th/#">
                        <img src="https://img.icons8.com/color/48/000000/twitter-squared.png">
                      </a>
                    </v-flex>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex
              xs12
              sm4
              offset-sm1
            >
              <v-card class="elevation-0 transparent">
                <v-card-title
                  primary-title
                  class="layout justify-center"
                >
                  <div class="headline">
                    Contact us
                  </div>
                </v-card-title>
                <v-card-text>
                  บริษัท โมบาย คอนเน็ค จำกัด 1111/84 ถนนลาดพร้าว, จันทรเกษม, จตุจักร, กรุงเทพมหานคร 10900
                </v-card-text>
                <v-card-text>
                  Mobile Connect Co., Ltd. 1111/84 Ladprao Rd., Chankasem Chatuchak Bangkok 10900
                </v-card-text>
                <v-list class="transparent">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon class="blue--text text--lighten-2">
                        phone
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>06 5895 8328</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon class="blue--text text--lighten-2">
                        place
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>กรุงเทพมหานคร, ประเทศไทย</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon class="blue--text text--lighten-2">
                        email
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>info@mobileconnect.co.th</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>

      <v-footer class="green darken-2">
        <v-layout
          row
          wrap
          align-center
        >
          <v-flex xs12>
            <center>
              <div class="white--text ml-3">
                2018 © Copyright www.sms2mkt.com All Rights Reserved.
              </div>
            </center>
          </v-flex>
        </v-layout>
      </v-footer>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

</style>
