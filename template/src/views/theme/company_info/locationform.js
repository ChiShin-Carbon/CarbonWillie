import { CRow, CCol, CFormLabel, CFormInput, CFormSelect } from '@coreui/react'
import '../../../scss/個人&企業資料.css'

const LocationForm = ({
  county,
  town,
  postal_code,
  onCountyChange,
  onTownChange,
  onPostalCodeChange,
}) => {
  const cities = {
    臺北市: {
      中正區: '100',
      大同區: '103',
      中山區: '104',
      松山區: '105',
      大安區: '106',
      萬華區: '108',
      信義區: '110',
      士林區: '111',
      北投區: '112',
      內湖區: '114',
      南港區: '115',
      文山區: '116',
    },
    基隆市: {
      仁愛區: '200',
      信義區: '201',
      中正區: '202',
      中山區: '203',
      安樂區: '204',
      暖暖區: '205',
      七堵區: '206',
    },
    新北市: {
      萬里區: '207',
      金山區: '208',
      板橋區: '220',
      汐止區: '221',
      深坑區: '222',
      石碇區: '223',
      瑞芳區: '224',
      平溪區: '226',
      雙溪區: '227',
      貢寮區: '228',
      新店區: '231',
      坪林區: '232',
      烏來區: '233',
      永和區: '234',
      中和區: '235',
      土城區: '236',
      三峽區: '237',
      樹林區: '238',
      鶯歌區: '239',
      三重區: '241',
      新莊區: '242',
      泰山區: '243',
      林口區: '244',
      蘆洲區: '247',
      五股區: '248',
      八里區: '249',
      淡水區: '251',
      三芝區: '252',
      石門區: '253',
    },
    宜蘭縣: {
      宜蘭: '260',
      頭城: '261',
      礁溪: '262',
      壯圍: '263',
      員山: '264',
      羅東: '265',
      三星: '266',
      大同: '267',
      五結: '268',
      冬山: '269',
      蘇澳: '270',
      南澳: '272',
      釣魚臺列嶼: '290',
    },
    新竹市: {
      全區: '300'
    },
    新竹縣: {
      竹北: '302',
      湖口: '303',
      新豐: '304',
      新埔: '305',
      關西: '306',
      芎林: '307',
      寶山: '308',
      竹東: '310',
      五峰: '311',
      橫山: '312',
      尖石: '313',
      北埔: '314',
      峨眉: '315',
    },
    桃園市: {
      中壢區: '320',
      平鎮區: '324',
      龍潭區: '325',
      楊梅區: '326',
      新屋區: '327',
      觀音區: '328',
      桃園區: '330',
      龜山區: '333',
      八德區: '334',
      大溪區: '335',
      復興區: '336',
      大園區: '337',
      蘆竹區: '338',
    },
    苗栗縣: {
      竹南: '350',
      頭份: '351',
      三灣: '352',
      南庄: '353',
      獅潭: '354',
      後龍: '356',
      通霄: '357',
      苑裡: '358',
      苗栗: '360',
      造橋: '361',
      頭屋: '362',
      公館: '363',
      大湖: '364',
      泰安: '365',
      銅鑼: '366',
      三義: '367',
      西湖: '368',
      卓蘭: '369',
    },
    臺中市: {
      中區: '400',
      東區: '401',
      南區: '402',
      西區: '403',
      北區: '404',
      北屯區: '406',
      西屯區: '407',
      南屯區: '408',
      太平區: '411',
      大里區: '412',
      霧峰區: '413',
      烏日區: '414',
      豐原區: '420',
      后里區: '421',
      石岡區: '422',
      東勢區: '423',
      和平區: '424',
      新社區: '426',
      潭子區: '427',
      大雅區: '428',
      神岡區: '429',
      大肚區: '432',
      沙鹿區: '433',
      龍井區: '434',
      梧棲區: '435',
      清水區: '436',
      大甲區: '437',
      外埔區: '438',
      大安區: '439',
    },
    彰化縣: {
      彰化: '500',
      芬園: '502',
      花壇: '503',
      秀水: '504',
      鹿港: '505',
      福興: '506',
      線西: '507',
      和美: '508',
      伸港: '509',
      員林: '510',
      社頭: '511',
      永靖: '512',
      埔心: '513',
      溪湖: '514',
      大村: '515',
      埔鹽: '516',
      田中: '520',
      北斗: '521',
      田尾: '522',
      埤頭: '523',
      溪州: '524',
      竹塘: '525',
      二林: '526',
      大城: '527',
      芳苑: '528',
      二水: '530',
    },
    南投縣: {
      南投: '540',
      中寮: '541',
      草屯: '542',
      國姓: '544',
      埔里: '545',
      仁愛: '546',
      名間: '551',
      集集: '552',
      水里: '553',
      魚池: '555',
      信義: '556',
      竹山: '557',
      鹿谷: '558',
    },
    嘉義市: {
      全區: '600'
    },
    嘉義縣: {
      番路: '602',
      梅山: '603',
      竹崎: '604',
      阿里山: '605',
      中埔: '606',
      大埔: '607',
      水上: '608',
      鹿草: '611',
      太保: '612',
      朴子: '613',
      東石: '614',
      六腳: '615',
      新港: '616',
      民雄: '621',
      大林: '622',
      溪口: '623',
      義竹: '624',
      布袋: '625',
    },
    雲林縣: {
      斗南: '630',
      大埤: '631',
      虎尾: '632',
      土庫: '633',
      褒忠: '634',
      東勢: '635',
      臺西: '636',
      崙背: '637',
      麥寮: '638',
      斗六: '640',
      林內: '643',
      古坑: '646',
      莿桐: '647',
      西螺: '648',
      二崙: '649',
      北港: '651',
      水林: '652',
      口湖: '653',
      四湖: '654',
      元長: '655',
    },
    臺南市: {
      中西區: '700',
      東區: '701',
      南區: '702',
      北區: '704',
      安平區: '708',
      安南區: '709',
      永康區: '710',
      歸仁區: '711',
      新化區: '712',
      左鎮區: '713',
      玉井區: '714',
      楠西區: '715',
      南化區: '716',
      仁德區: '717',
      關廟區: '718',
      龍崎區: '719',
      官田區: '720',
      麻豆區: '721',
      佳里區: '722',
      西港區: '723',
      七股區: '724',
      將軍區: '725',
      學甲區: '726',
      北門區: '727',
      新營區: '730',
      後壁區: '731',
      白河區: '732',
      東山區: '733',
      六甲區: '734',
      下營區: '735',
      柳營區: '736',
      鹽水區: '737',
      善化區: '741',
      大內區: '742',
      山上區: '743',
      新市區: '744',
      安定區: '745',
    },
    高雄市: {
      新興區: '800',
      前金區: '801',
      苓雅區: '802',
      鹽埕區: '803',
      鼓山區: '804',
      旗津區: '805',
      前鎮區: '806',
      三民區: '807',
      楠梓區: '811',
      小港區: '812',
      左營區: '813',
      仁武區: '814',
      大社區: '815',
      岡山區: '820',
      路竹區: '821',
      阿蓮區: '822',
      田寮區: '823',
      燕巢區: '824',
      橋頭區: '825',
      梓官區: '826',
      彌陀區: '827',
      永安區: '828',
      湖內區: '829',
      鳳山區: '830',
      大寮區: '831',
      林園區: '832',
      鳥松區: '833',
      大樹區: '840',
      旗山區: '842',
      美濃區: '843',
      六龜區: '844',
      內門區: '845',
      杉林區: '846',
      甲仙區: '847',
      桃源區: '848',
      那瑪夏區: '849',
      茂林區: '851',
      茄萣區: '852',
    },
    南海諸島: {
      東沙: '817',
      南沙: '819',
    },
    澎湖縣: {
      馬公: '880',
      西嶼: '881',
      望安: '882',
      七美: '883',
      白沙: '884',
      湖西: '885',
    },
    屏東縣: {
      屏東: '900',
      三地門: '901',
      霧臺: '902',
      瑪家: '903',
      九如: '904',
      里港: '905',
      高樹: '906',
      鹽埔: '907',
      長治: '908',
      麟洛: '909',
      竹田: '911',
      內埔: '912',
      萬丹: '913',
      潮州: '920',
      泰武: '921',
      來義: '922',
      萬巒: '923',
      崁頂: '924',
      新埤: '925',
      南州: '926',
      林邊: '927',
      東港: '928',
      琉球: '929',
      佳冬: '931',
      新園: '932',
      枋寮: '940',
      枋山: '941',
      春日: '942',
      獅子: '943',
      車城: '944',
      牡丹: '945',
      恆春: '946',
      滿州: '947',
    },
    臺東縣: {
      臺東: '950',
      綠島: '951',
      蘭嶼: '952',
      延平: '953',
      卑南: '954',
      鹿野: '955',
      關山: '956',
      海端: '957',
      池上: '958',
      東河: '959',
      成功: '961',
      長濱: '962',
      太麻里: '963',
      金峰: '964',
      大武: '965',
      達仁: '966',
    },
    花蓮縣: {
      花蓮: '970',
      新城: '971',
      秀林: '972',
      吉安: '973',
      壽豐: '974',
      鳳林: '975',
      光復: '976',
      豐濱: '977',
      瑞穗: '978',
      萬榮: '979',
      玉里: '981',
      卓溪: '982',
      富里: '983',
    },
    金門縣: {
      金沙: '890',
      金湖: '891',
      金寧: '892',
      金城: '893',
      烈嶼: '894',
      烏坵: '896',
    },
    連江縣: {
      南竿: '209',
      北竿: '210',
      莒光: '211',
      東引: '212',
    },
  }

  const handleCountyChange = (e) => {
    const selectedCounty = e.target.value
    onCountyChange(selectedCounty)
    onTownChange('') // 清空鄉鎮
    onPostalCodeChange('') // 清空郵遞區號
  }

  const handleTownChange = (e) => {
    const selectedTown = e.target.value
    onTownChange(selectedTown)
    
    // Make sure cities[county] is an object and the selectedTown exists
    if (county && cities[county] && typeof cities[county] === 'object' && cities[county][selectedTown]) {
      onPostalCodeChange(cities[county][selectedTown])
    }
  }

  // Helper function to check if a city has district/town data
  const hasDistricts = (cityName) => {
    return cityName && cities[cityName] && typeof cities[cityName] === 'object'
  }

  return (
    <CRow className="mb-3">
      <CCol sm={4}>
        <div className="mb-3">
          <CFormLabel>
            <strong>縣市別</strong>
          </CFormLabel>
          <CFormSelect id="edit_county" value={county} onChange={handleCountyChange}>
            <option value="">選擇縣市別</option>
            {Object.keys(cities).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </CFormSelect>
        </div>
      </CCol>
      <CCol sm={4}>
        <div className="mb-3">
          <CFormLabel>
            <strong>鄉鎮別</strong>
          </CFormLabel>
          <CFormSelect id="edit_town" value={town} onChange={handleTownChange} disabled={!hasDistricts(county)}>
            <option value="">選擇鄉鎮別</option>
            {hasDistricts(county) &&
              Object.keys(cities[county]).map((township) => (
                <option key={township} value={township}>
                  {township}
                </option>
              ))}
          </CFormSelect>
        </div>
      </CCol>
      <CCol sm={4}>
        <div className="mb-3">
          <CFormLabel>
            <strong>郵遞區號</strong>
          </CFormLabel>
          <CFormInput type="text" id="edit_postal_code" value={postal_code} readOnly />
        </div>
      </CCol>
    </CRow>
  )
}

export default LocationForm