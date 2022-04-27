import React, {Fragment, useRef, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Card, Checkbox, Col, Form, Input} from "antd";
import {FormInput} from "../form/FormInput";
import {isLogined} from "../../helper/utils";
import {useAuthState} from "../../context";
import {FormLabel} from "../form/FormLabel";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import validation from 'validator'
import {createAccout} from "../../api/axiosAPIs";
import {ERROR, openNotificationWithIcon, SUCCESS} from "../common/Messages";
import {
    HTTP_SUCCESS,
} from "../../constants/ResponseCode";
const languages = [
    {
        code: 'en',
        name: 'English',
        country_code: 'gb',
    },
    {
        code: 'ja',
        name: 'Japanese',
        country_code: 'ja',
    },
    {
        code: 'id',
        name: 'Indonesian',
        country_code: 'id',
    },
    {
        code: 'vi',
        name: 'Vietnamese',
        country_code: 'vi',
    },
]
export const RegisterCompanyComponent = (props) => {
    const currentLanguageCode = cookies.get('i18next') || 'en'
    const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
    console.log('current language1', currentLanguage)
    const { t } = useTranslation()

    let history = useHistory();
    const {loading, profile} = useAuthState();
    const formRef = useRef();
    const [isConfirm, setIsConfirm] = useState(false);
    const [initFormValue] = useState(isLogined(profile) ? {
        inquiry_name: profile.name,
        email: profile.email,
        coin_address: profile.coin_address
    } : {});

    const items = [
        {to: '', label: 'お問い合わせ'},
    ]

    const onChangeInputConfirm = e => {
        setIsConfirm(e)
    }

    const onFinish = async(data) => {
        let formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('account', data.account)
        formData.append('referId', '')
        formData.append('referEmail', data.referEmail? data.referEmail : '')
        formData.append('createdAt', data.createdAt)
        let response = {}
        try {
            response = await createAccout(formData)
            if (response.status === HTTP_SUCCESS) {
                console.log("create_successfully!")
                openNotificationWithIcon(SUCCESS, props.intl.formatMessage({id: 'message.success.user'}))
            }
        } catch (error) {
            console.log(error)
        }

    }

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    }

    useEffect(() => {
        console.log('Setting page stuff')
        document.body.dir = currentLanguage.dir || 'ltr'
        document.title = props.intl.formatMessage({id: 'app_title'})
    }, [currentLanguage, t])

  return (
    <Fragment>
      <div>
        <div>
          <img alt="" src={require('../../assets/img/HBY-logo2-1.png')} style={{width: '100%', height: '100%'}}/>
        </div>
      </div>
      <div className={"pt-4 lg:pb-20 sm:px-0 md:px-8 lg:px-30 xl:px-56 bg-yellow-light"}>
          <div className={"lg:px-32 lg:pb-12"}>
              <div className={"flex items-center justify-center lg:m-10"}>
                  <span className={"blue-color text-3xl font-bold"}>{props.intl.formatMessage({id: 'str.item.new.register'})}</span>
              </div>
              <Card className={"flex items-center justify-center"}>
                  <Form
                      ref={formRef}
                      onFinish={onFinish}
                      initialValues={initFormValue}
                  >
                      <Col className={"lg:ml-20"} style={{marginBottom: '2rem'}}>
                          <div className={"flex items-center mt-2"}>
                              <span className={"text-base"}>{props.intl.formatMessage({id: 'str.item.register.step1'})}</span>
                          </div>
                      </Col>
                      {/*氏名*/}
                      <FormInput
                          label={props.intl.formatMessage({id: 'form.item.name'})}
                          name={"name"}
                          placeholder={props.intl.formatMessage({id: 'form.item.name.confirm'})}
                          intl={props.intl}
                          required={true}
                          readOnly={false}
                      />
                      <Col className={"lg:ml-20"} style={{marginBottom: '2rem'}}>
                          <div className={"flex items-center mt-2"}>
                              <span className={"text-base"}>{props.intl.formatMessage({id: 'str.item.register.step2'})}</span>
                          </div>
                      </Col>
                      {/*メールアドレス*/}
                      <Fragment>
                          <div>
                              <FormLabel label={props.intl.formatMessage({id: 'form.item.email'})} required={true}/>
                              <Col lg={16} className={"p-0 lg:ml-24"} >
                                  <Form.Item
                                      name={"email"}
                                      rules={[{required: true, 
                                        type: "email",
                                        message: props.intl.formatMessage({id: 'alert.fieldRequired'})}]}
                                  >
                                      <Input size={"large"} type={"email"} placeholder={props.intl.formatMessage({id: 'form.item.email.confirm'})}/>
                                  </Form.Item>
                              </Col>
                          </div>
                      </Fragment>
                      <Col className={"lg:ml-20"} style={{marginBottom: '2rem'}}>
                          <div className={"flex items-center mt-2"}>
                              <span className={"text-base"}>{props.intl.formatMessage({id: 'str.item.register.step3'})}</span>
                          </div>
                      </Col>
                      <FormInput
                          label={props.intl.formatMessage({id: 'form.item.coin.address'})}
                          name={"account"}
                          placeholder=""
                          intl={props.intl}
                          required={true}
                          readOnl={false}
                      />
                      <Col className={"lg:ml-20"} style={{marginBottom: '2rem'}}>
                          <div className={"flex items-center mt-2"}>
                              <span className={"text-base"}>
                                <a href= "https://rabbitmember.com/token-pocket-kaisetu/" target="_blank" >{props.intl.formatMessage({id: 'str.item.link.tokenpoket'})}</a>
                              </span>
                          </div>
                      </Col>
                      <Col className={"lg:ml-20"} style={{marginBottom: '2rem'}}>
                          <div className={"flex items-center mt-2"}>
                              <span className={"text-base"}>{props.intl.formatMessage({id: 'str.item.register.step4'})}</span>
                          </div>
                      </Col>
                      {/*紹介者*/}
                      <Fragment>
                          <div>
                              <FormLabel label={props.intl.formatMessage({id: 'form.item.introduce.name'})}/>
                              <Col lg={16} className={"p-0 lg:ml-24"} >
                                  <Form.Item
                                      name={"referEmail"}
                                      rules={[{required: false, 
                                        type: "email",
                                        message: props.intl.formatMessage({id: 'alert.fieldReferEmailConfirm'})}]}
                                    //   rules={[
                                    //       ({getFieldValue}) => ({
                                    //           validator(_, value) {
                                    //               if(validation.isEmpty(value)) {
                                    //                   console.log('#############')
                                    //                 return Promise.resolve()
                                    //               }
                                    //               if (getFieldValue("email") == value) {
                                    //                 console.log('@@@@@@@@@@@')
                                    //                   return Promise.reject(new Error(props.intl.formatMessage({id: 'alert.fieldReferEmailDuplicate'})))
                                    //               }
                                    //               if(validation.isEmail(value)) {
                                    //                 console.log('!!!!!!!!!!')
                                    //                 return Promise.resolve()  
                                    //               }
                                    //               else {
                                    //                 console.log('&&&&&&&&&&&&')
                                    //                 return Promise.reject(new Error(props.intl.formatMessage({id: 'alert.fieldReferEmailConfirm'})))
                                    //               }
                                    //               //return Promise.resolve()
                                    //           }
                                    //       })
                                    //   ]}
                                  >
                                      <Input size={"large"} type={"email"} placeholder={props.intl.formatMessage({id: 'form.item.name.confirm'})}/>
                                  </Form.Item>
                              </Col>
                          </div>
                      </Fragment>
                      <Fragment>
                          <div>
                              <FormLabel label={props.intl.formatMessage({id: 'form.item.introduce.date'})} required={true}/>
                              <Col lg={16} className={"p-0 lg:ml-24"} >
                                  <Form.Item
                                      name={"createdAt"}
                                      rules={[{required: true, message: props.intl.formatMessage({id: 'alert.fieldRequired'})}]}
                                  >
                                      <Input type={"date"} size={"large"} placeholder={props.placeholder} readOnly={props.readOnly}/>
                                  </Form.Item>
                              </Col>
                          </div>
                      </Fragment>

                      <Col className={"lg:ml-24"}>
                          <div className={"flex items-center mt-5 mb-5"}>
                              <img alt="" src={require('../../assets/images/require.png')}/>
                              <div className={"ml-3"}>
                                  <Checkbox onChange={onChangeInputConfirm}>
                                      <span className={"text-base ml-1"}>{props.intl.formatMessage({id: 'str.item.policy.confirm'})}</span>
                                  </Checkbox>
                              </div>
                          </div>
                          <div className={"flex items-center mb-5"}>
                                  <span className={"text-base whitespace-no-wrap"}>
                                    <a href= "https://rabbitmember.com/terms-of-service/" target="_blank" >{props.intl.formatMessage({id: 'str.item.policy'})}</a>
                                  </span>
                          </div>
                      </Col>
                      <div className={"flex items-center justify-center"}>
                          <Col className={"lg:ml-8"}>
                              <button
                                  type="submit"
                                  disabled={!isConfirm}
                                  className={"flex items-center justify-center btn-secondary-semi-round text-yellow text-lg"}
                                  style={{width: 315, height: 55}}
                              >
                                  <span>{props.intl.formatMessage({id: 'btn.send'})}</span>
                              </button>
                          </Col>
                      </div>
                  </Form>
              </Card>
          </div>
      </div>
    </Fragment>
  )
}