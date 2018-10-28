<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout },
}
</script>

<template>
  <Layout>
    <v-content>
      <v-container
        fluid
      >
        <section>
          <v-parallax
            src="/img/background.jpg"
            height="600"
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
              <h1 class="white--text mb-2 display-1 text-xs-center">2WAYS SMS</h1>
              <!-- <div class="subheading mb-3 text-xs-center"></div> -->
              <v-btn
                class="green mt-5"
                dark
                large
                round
                href="/login"
              >
                TEL. 06 5895 8328
              </v-btn>
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
            >
              <div class="text-xs-center">
                <h2 class="headline">ตัวอย่างแคมเปญ 2WAYS SMS</h2>
                <span class="subheading">
                  จากองค์กรและแบรนด์สินค้าดัง ที่เราได้รับความไว้วางใจให้บริการ
                </span>
              </div>
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
                      <v-card-text class="text-xs-center">
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
                        <div class="headline text-xs-center">Material Design</div>
                      </v-card-title>
                      <v-card-text>
                        Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
                        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex
                    xs12
                    md4
                  >
                    <v-card class="elevation-0 transparent">
                      <v-card-text class="text-xs-center">
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
                        <div class="headline">Fast development</div>
                      </v-card-title>
                      <v-card-text>
                        Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
                        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex
                    xs12
                    md4
                  >
                    <v-card class="elevation-0 transparent">
                      <v-card-text class="text-xs-center">
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
                        <div class="headline text-xs-center">Completely Open Sourced</div>
                      </v-card-title>
                      <v-card-text>
                        Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
                        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti.
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </section>

        <section>
          <v-parallax
            src="/img/technology.jpg"
            height="380"
          >
            <v-layout
              column
              align-center
              justify-center
            >
              <div class="headline white--text mb-3 text-xs-center">หากสนใจและต้องการสอบถามข้อมูลเพิ่มเติม ติดต่อฝ่ายขาย</div>
              <em>One Stop Service : เราคือ ผู้นำด้านให้บริการ 2Ways SMS ที่ดีที่สุด</em>
              <v-btn
                class="indigo mt-5"
                dark
                large
                round
                href="/login"
              >
                TEL. 06 5895 8328
              </v-btn>
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
                    <div class="headline">Company info</div>
                  </v-card-title>
                  <v-card-text>
                    บริษัท โมบาย คอนเน็ค จำกัด เป็นผู้ให้บริการ Mobile Marketing & CRM แบบครบวงจร ด้วยทีมงานที่มีความ
                    เชี่ยวชาญ และ มีประสบการณ์ให้บริการแก่องค์กรชั้นนำต่าง ๆ ทั้งในประเทศไทย และต่างประเทศ การันตีจากประสบการณ์ 18 ปี
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
                    <div class="headline">Contact us</div>
                  </v-card-title>
                  <v-card-text>
                    บริษัท โมบาย คอนเน็ค จำกัด 1111/84 ถนนลาดพร้าว, จันทรเกษม, จตุจักร, กรุงเทพมหานคร 10900
                  </v-card-text>
                  <v-list class="transparent">
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon class="blue--text text--lighten-2">phone</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>06 5895 8328</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon class="blue--text text--lighten-2">place</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>กรุงเทพมหานคร, ประเทศไทย</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-icon class="blue--text text--lighten-2">email</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>info@mobileconnect.co.th</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
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
                <div class="white--text ml-3">2018 © Copyright www.sms2mkt.com All Rights Reserved.</div>
              </center>
            </v-flex>
          </v-layout>
        </v-footer>
      </v-container>
    </v-content>
  </Layout>
</template>
