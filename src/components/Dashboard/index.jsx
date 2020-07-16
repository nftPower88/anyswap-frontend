import React, { useState, useEffect, useCallback  } from 'react'
// import ReactGA from 'react-ga'
import { ethers } from 'ethers'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useWeb3React } from '../../hooks'
import { formatTokenBalance, formatEthBalance, amountFormatter } from '../../utils'
import { useAddressBalance} from '../../contexts/Balances'
import { useAllTokenDetails} from '../../contexts/Tokens'
import { useExchangeContract } from '../../hooks'
import TokenLogo from '../TokenLogo'
import { useAllBalances } from '../../contexts/Balances'
import { TitleBox, BorderlessInput } from '../../theme'

import SearchIcon from '../../assets/images/icon/search.svg'
import { NavLink } from 'react-router-dom'

import GraphUpIcon from '../../assets/images/icon/graph-up.svg'
import AnyillustrationIcon from '../../assets/images/icon/any-illustration.svg'

import { ReactComponent as Dropup } from '../../assets/images/dropup-blue.svg'
import { ReactComponent as Dropdown } from '../../assets/images/dropdown-blue.svg'
import ScheduleIcon from '../../assets/images/icon/schedule.svg'
const MyBalanceBox = styled.div`
  width: 100%;
  
  border-radius: 0.5625rem;
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  padding: 1rem 2.5rem;
  @media screen and (max-width: 960px) {
    padding: 1rem 1rem;
  }
`

const TitleAndSearchBox = styled.div`
  ${({theme}) => theme.FlexBC};
  margin-bottom:1.5625rem;
  font-family: 'Manrope';
  h3 {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.5;
    color: #062536;
    margin:0 1.25rem 0 0;
    white-space:nowrap;
  }
`
const SearchBox = styled.div`
  width: 100%;
  max-width: 296px;
  height: 2.5rem;
  
  border-radius: 0.5625rem;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding-left: 2.5rem;
  position:relative;

  .icon {
    ${({theme}) => theme.FlexC};
    width:2.5rem;
    height:2.5rem;
    position:absolute;
    top:0;
    left:0;
    cursor: pointer;
  }
`

const SearchInput = styled(BorderlessInput)`
  width: 100%;
  height: 100%;
  border:none;
  background:none;
  font-family: 'Manrope';
  
  font-size: 0.75rem;
  font-weight: normal;
  
  
  line-height: 1.67;
  
  color: #062536;
  padding-right:0.625rem;

  ::placeholder {
  }
`

const WrapperBox = styled.div`
  ${({theme}) => theme.FlexBC};
  margin-top:1rem;
  @media screen and (max-width: 960px) {
    justify-content:center;;
    flex-wrap:wrap;
    flex-direction: column-reverse ;
  }
`
const EarningsBox = styled.div`
  width: 33.33%;
  height: 386px;
  border-radius: 0.5625rem;
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  padding:1.25rem;
  font-family: 'Manrope';
  .bgImg {
    width: 149px;
    height: 148px;
    margin: 0 auto 1.875rem;
    padding-bottom:1.875rem;
    border-bottom: 0.0625rem solid #ededed;
  }
  h3 {
    font-size: 1.625rem;
    font-weight: bold;
    line-height: 1.15;
    letter-spacing: -1.18px;
    text-align: center;
    color: #062536;
    text-align:center;
    white-space:nowrap;
    margin: 1.875rem 0 6px;
  }
  p {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.43;
    text-align: center;
    color: #062536;
    text-align:center;
    margin: 0 0 1.5625rem;
  }
  .txt {
    ${({theme}) => theme.FlexC};
    height: 42px;
    border-radius: 6px;
    border: solid 0.0625rem #a3daab;
    background-color: #e2f9e5;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 0.86;
    color: #031a6e;
    span {
      font-weight:bold;
      margin:0 5px;
    }
  }
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`

const ProvideLiqBox = styled.div`
width: 64.92%;
height: 386px;

border-radius: 0.5625rem;
box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
background-color: #ffffff;
padding: 1rem 2.5rem;
@media screen and (max-width: 960px) {
  padding: 1rem 1rem;
  width: 100%;
  margin-bottom:1rem;
}
`
const MyBalanceTokenBox  = styled.div`
width:100%;
height: 240px;
overflow:hidden;
&.showMore {
  height:auto;
  overflow:auto;
}
`
const MyBalanceTokenBox1 = styled(MyBalanceTokenBox)`
overflow:auto;
`
const TokenTableBox = styled.ul`
  width:100%;
  list-style:none;
  margin:0;
  padding:0;
`

const TokenTableList = styled.li`
${({theme}) => theme.FlexBC};
  width: 100%;
  height: 70px;
  
  border-radius: 0.5625rem;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 1rem 0;
  margin-bottom: 0.625rem;
  @media screen and (max-width: 960px) {
    padding: 1rem 5px;
  }
`
const TokenTableCoinBox  = styled.div`
${({theme}) => theme.FlexSC};
  border-right: 0.0625rem  solid rgba(0, 0, 0, 0.1);
  padding: 0 1.5625rem;
  min-width: 217px
  width:30%;
  @media screen and (max-width: 960px) {
    min-width: 120px;
    padding: 0 5px;
  }
`
const TokenTableLogo = styled.div`
${({theme}) => theme.FlexC};
  width: 36px;
  height: 36px;
  
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius:100%;
  padding: 0.625rem;
  margin-right: 1.25rem;
  @media screen and (max-width: 960px) {
    margin-right: 5px;
    padding: 5px;
  }
`

const TokenNameBox  = styled.div`
font-family: 'Manrope';
  h3 {
    margin:0;
    
    font-size: 1rem;
    font-weight: 800;
    
    
    line-height: 1.25;
    
    color: #031a6e;
    white-space:nowrap;
  }
  p {
    margin: 0.125rem 0 0;
    
    font-size: 0.75rem;
    font-weight: normal;
    
    
    line-height: 1;
    
    color: #031a6e;
  }
`

const TokenBalanceBox  = styled.div`
font-family: 'Manrope';
  min-width: 120px
  width:30%;
  text-align:left;
  h3 {
    padding-left: 17.97%;
    margin:0;
    
    font-size: 0.75rem;
    font-weight: normal;
    
    
    line-height: 1;
    
    color: #062536;
    white-space:nowrap;
  }
  p {
    padding-left: 17.97%;
    margin: 0.125rem 0 0;
    
    font-size: 0.875rem;
    font-weight: 800;
    
    
    line-height: 1.43;
    
    color: #062536;
  }
  @media screen and (max-width: 960px) {
    min-width: 80px;
    h3 {
      padding-left: 1rem;
    }
    p {
      padding-left: 1rem;
    }
  }
`

const TokenActionBox  = styled.div`
${({theme}) => theme.FlexC};
  width: 40%;
  padding: 0 1.25rem;
`
const TokenActionBtn  = styled(NavLink)`
${({theme}) => theme.FlexC};
font-family: 'Manrope';
  width: 88px;
  height: 38px;
  
  border-radius: 0.5625rem;
  background: #ecf6ff;
  margin-right: 0.125rem;
  
  font-size: 0.75rem;
  font-weight: 500;
  
  
  line-height: 1;
  
  color: #062536;
  box-shadow: none;
  padding:0;
  text-decoration: none;
  &:hover,&:focus,&:active {
    background:#ecf6ff;
  }
`
const TokenActionBtnSwap = styled(TokenActionBtn)`
margin-right:0.125rem;
`

const TokenActionBtnSend = styled(TokenActionBtn)`

`

const MoreBtnBox = styled.div`
${({theme}) => theme.FlexC};
font-family: 'Manrope';
  width: 110px;
  height: 34px;
  
  border-radius: 6px;
  background-color: #f9fafb;
  
  font-size: 0.75rem;
  font-weight: 500;
  
  
  line-height: 1.17;
  
  color: #734be2;
  margin: 1.25rem auto 0;
  cursor:pointer;
`

const WrappedDropup = ({ isError, highSlippageWarning, ...rest }) => <Dropup {...rest} />
const ColoredDropup = styled(WrappedDropup)`
margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.royalBlue};
  }
`

const WrappedDropdown = ({ isError, highSlippageWarning, ...rest }) => <Dropdown {...rest} />
const ColoredDropdown = styled(WrappedDropdown)`
margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.royalBlue};
  }
`

const ComineSoon = styled.div`
${({theme}) => theme.FlexC}
font-family: 'Manrope';
  font-size: 0.75rem;
  color: #96989e;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  background-color: #f5f5f5;
`

export default function DashboardDtil () {
  const { account, library } = useWeb3React()
  const allBalances = useAllBalances()
  const allTokens = useAllTokenDetails()
  const { t } = useTranslation()

  // console.log(allTokens)
  let allCoins = {}
  let poolInfoObj = {}
  for (let obj in allTokens) {
    allCoins[allTokens[obj].symbol] = {
      ...allTokens[obj],
      token: obj
    }
    poolInfoObj[allTokens[obj].symbol]= {
      poolTokenBalance: '',
      exchangeETHBalance: '',
      exchangeTokenBalancem: '',
      exchangeContract: '',
      totalPoolTokens: '',
      fetchPoolTokensm: '',
      poolTokenPercentage: '',
      ethSharemBTC: '',
      tokenShare: '',
      ethShare: ''
    }
  }
  const tokenShareFSN =useAddressBalance(account, 'FSN')
  // console.log(tokenShareFSN)

  const [searchBalance, setSearchBalance] =  useState('')
  const [searchPool, setSearchPool] =  useState('')
  const [showMore, setShowMore] =  useState(false)


  // console.log(allCoins)
  /**
   * mBTC start
   *  */
  poolInfoObj.mBTC.poolTokenBalance = useAddressBalance(account, allCoins.mBTC.exchangeAddress)
  poolInfoObj.mBTC.exchangeETHBalance = useAddressBalance(allCoins.mBTC.exchangeAddress, 'FSN')
  poolInfoObj.mBTC.exchangeTokenBalancem = useAddressBalance(allCoins.mBTC.exchangeAddress, allCoins.mBTC.token)
  poolInfoObj.mBTC.exchangeContract = useExchangeContract(allCoins.mBTC.exchangeAddress)
  
  const [totalPoolTokensmBTC, setTotalPoolTokensmBTC] = useState()
  poolInfoObj.mBTC.fetchPoolTokensm = useCallback(() => {
    if (poolInfoObj.mBTC.exchangeContract) {
      poolInfoObj.mBTC.exchangeContract.totalSupply().then(totalSupply => {
        setTotalPoolTokensmBTC(totalSupply)
      })
    }
  }, [poolInfoObj.mBTC.exchangeContract])
  useEffect(() => {
    poolInfoObj.mBTC.fetchPoolTokensm()
    library.on('block', poolInfoObj.mBTC.fetchPoolTokensm)

    return () => {
      library.removeListener('block', poolInfoObj.mBTC.fetchPoolTokensm)
    }
  }, [poolInfoObj.mBTC.fetchPoolTokensm, library])
  poolInfoObj.mBTC.totalPoolTokens = totalPoolTokensmBTC

  /**
   * mBTC end
   *  */

  /**
   * ANY start
   *  */
  poolInfoObj.ANY.poolTokenBalance = useAddressBalance(account, allCoins.ANY.exchangeAddress)
  poolInfoObj.ANY.exchangeETHBalance = useAddressBalance(allCoins.ANY.exchangeAddress, 'FSN')
  poolInfoObj.ANY.exchangeTokenBalancem = useAddressBalance(allCoins.ANY.exchangeAddress, allCoins.ANY.token)
  poolInfoObj.ANY.exchangeContract = useExchangeContract(allCoins.ANY.exchangeAddress)
  
  const [totalPoolTokensANY, setTotalPoolTokensANY] = useState()
  poolInfoObj.ANY.fetchPoolTokensm = useCallback(() => {
    if (poolInfoObj.ANY.exchangeContract) {
      poolInfoObj.ANY.exchangeContract.totalSupply().then(totalSupply => {
        setTotalPoolTokensANY(totalSupply)
      })
    }
  }, [poolInfoObj.ANY.exchangeContract])
  useEffect(() => {
    poolInfoObj.ANY.fetchPoolTokensm()
    library.on('block', poolInfoObj.ANY.fetchPoolTokensm)

    return () => {
      library.removeListener('block', poolInfoObj.ANY.fetchPoolTokensm)
    }
  }, [poolInfoObj.ANY.fetchPoolTokensm, library])
  poolInfoObj.ANY.totalPoolTokens = totalPoolTokensANY
  /**
   * ANY end
   *  */

  /**
   * mETH start
   *  */
  poolInfoObj.mETH.poolTokenBalance = useAddressBalance(account, allCoins.mETH.exchangeAddress)
  poolInfoObj.mETH.exchangeETHBalance = useAddressBalance(allCoins.mETH.exchangeAddress, 'FSN')
  poolInfoObj.mETH.exchangeTokenBalancem = useAddressBalance(allCoins.mETH.exchangeAddress, allCoins.mETH.token)
  poolInfoObj.mETH.exchangeContract = useExchangeContract(allCoins.mETH.exchangeAddress)
  
  const [totalPoolTokensmETH, setTotalPoolTokensmETH] = useState()
  poolInfoObj.mETH.fetchPoolTokensm = useCallback(() => {
    if (poolInfoObj.mETH.exchangeContract) {
      poolInfoObj.mETH.exchangeContract.totalSupply().then(totalSupply => {
        setTotalPoolTokensmETH(totalSupply)
      })
    }
  }, [poolInfoObj.mETH.exchangeContract])
  useEffect(() => {
    poolInfoObj.mETH.fetchPoolTokensm()
    library.on('block', poolInfoObj.mETH.fetchPoolTokensm)

    return () => {
      library.removeListener('block', poolInfoObj.mETH.fetchPoolTokensm)
    }
  }, [poolInfoObj.mETH.fetchPoolTokensm, library])
  poolInfoObj.mETH.totalPoolTokens = totalPoolTokensmETH
  /**
   * mETH end
   *  */

   /**
   * mUSDT start
   *  */
  poolInfoObj.mUSDT.poolTokenBalance = useAddressBalance(account, allCoins.mUSDT.exchangeAddress)
  poolInfoObj.mUSDT.exchangeETHBalance = useAddressBalance(allCoins.mUSDT.exchangeAddress, 'FSN')
  poolInfoObj.mUSDT.exchangeTokenBalancem = useAddressBalance(allCoins.mUSDT.exchangeAddress, allCoins.mUSDT.token)
  poolInfoObj.mUSDT.exchangeContract = useExchangeContract(allCoins.mUSDT.exchangeAddress)
  
  const [totalPoolTokensmUSDT, setTotalPoolTokensmUSDT] = useState()
  poolInfoObj.mUSDT.fetchPoolTokensm = useCallback(() => {
    if (poolInfoObj.mUSDT.exchangeContract) {
      poolInfoObj.mUSDT.exchangeContract.totalSupply().then(totalSupply => {
        setTotalPoolTokensmUSDT(totalSupply)
      })
    }
  }, [poolInfoObj.mUSDT.exchangeContract])
  useEffect(() => {
    poolInfoObj.mUSDT.fetchPoolTokensm()
    library.on('block', poolInfoObj.mUSDT.fetchPoolTokensm)

    return () => {
      library.removeListener('block', poolInfoObj.mUSDT.fetchPoolTokensm)
    }
  }, [poolInfoObj.mUSDT.fetchPoolTokensm, library])
  poolInfoObj.mUSDT.totalPoolTokens = totalPoolTokensmUSDT
  /**
   * mUSDT end
   *  */

  /**
   * mXRP start
   *  */
  poolInfoObj.mXRP.poolTokenBalance = useAddressBalance(account, allCoins.mXRP.exchangeAddress)
  poolInfoObj.mXRP.exchangeETHBalance = useAddressBalance(allCoins.mXRP.exchangeAddress, 'FSN')
  poolInfoObj.mXRP.exchangeTokenBalancem = useAddressBalance(allCoins.mXRP.exchangeAddress, allCoins.mXRP.token)
  poolInfoObj.mXRP.exchangeContract = useExchangeContract(allCoins.mXRP.exchangeAddress)
  
  const [totalPoolTokensmXRP, setTotalPoolTokensmXRP] = useState()
  poolInfoObj.mXRP.fetchPoolTokensm = useCallback(() => {
    if (poolInfoObj.mXRP.exchangeContract) {
      poolInfoObj.mXRP.exchangeContract.totalSupply().then(totalSupply => {
        setTotalPoolTokensmXRP(totalSupply)
      })
    }
  }, [poolInfoObj.mXRP.exchangeContract])
  useEffect(() => {
    poolInfoObj.mXRP.fetchPoolTokensm()
    library.on('block', poolInfoObj.mXRP.fetchPoolTokensm)

    return () => {
      library.removeListener('block', poolInfoObj.mXRP.fetchPoolTokensm)
    }
  }, [poolInfoObj.mXRP.fetchPoolTokensm, library])
  poolInfoObj.mXRP.totalPoolTokens = totalPoolTokensmXRP
  /**
   * mXRP end
   *  */

   /**
   * mLTC start
   *  */
  poolInfoObj.mLTC.poolTokenBalance = useAddressBalance(account, allCoins.mLTC.exchangeAddress)
  poolInfoObj.mLTC.exchangeETHBalance = useAddressBalance(allCoins.mLTC.exchangeAddress, 'FSN')
  poolInfoObj.mLTC.exchangeTokenBalancem = useAddressBalance(allCoins.mLTC.exchangeAddress, allCoins.mLTC.token)
  poolInfoObj.mLTC.exchangeContract = useExchangeContract(allCoins.mLTC.exchangeAddress)
  
  const [totalPoolTokensmLTC, setTotalPoolTokensmLTC] = useState()
  poolInfoObj.mLTC.fetchPoolTokensm = useCallback(() => {
    if (poolInfoObj.mLTC.exchangeContract) {
      poolInfoObj.mLTC.exchangeContract.totalSupply().then(totalSupply => {
        setTotalPoolTokensmLTC(totalSupply)
      })
    }
  }, [poolInfoObj.mLTC.exchangeContract])
  useEffect(() => {
    poolInfoObj.mLTC.fetchPoolTokensm()
    library.on('block', poolInfoObj.mLTC.fetchPoolTokensm)

    return () => {
      library.removeListener('block', poolInfoObj.mLTC.fetchPoolTokensm)
    }
  }, [poolInfoObj.mLTC.fetchPoolTokensm, library])
  poolInfoObj.mLTC.totalPoolTokens = totalPoolTokensmLTC
  /**
   * mLTC end
   *  */


  let poolTokenBalanceArr = []
  for (let obj in allCoins) {
    if (obj === 'FSN') {
      poolInfoObj[obj].poolTokenPercentage =
        poolInfoObj['ANY'].poolTokenBalance && poolInfoObj['ANY'].totalPoolTokens && !poolInfoObj['ANY'].totalPoolTokens.isZero()
            ? poolInfoObj['ANY'].poolTokenBalance.mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))).div(poolInfoObj['ANY'].totalPoolTokens)
            : undefined
      poolInfoObj[obj].tokenShare = tokenShareFSN
    } else {
      poolInfoObj[obj].poolTokenPercentage =
        poolInfoObj[obj].poolTokenBalance && poolInfoObj[obj].totalPoolTokens && !poolInfoObj[obj].totalPoolTokens.isZero()
            ? poolInfoObj[obj].poolTokenBalance.mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))).div(poolInfoObj[obj].totalPoolTokens)
            : undefined
      poolInfoObj[obj].tokenShare =
        poolInfoObj[obj].exchangeTokenBalancem && poolInfoObj[obj].poolTokenPercentage
          ? poolInfoObj[obj].exchangeTokenBalancem
              .mul(poolInfoObj[obj].poolTokenPercentage)
              .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
          : undefined
      poolInfoObj[obj].ethShare =
        poolInfoObj[obj].exchangeETHBalance && poolInfoObj[obj].poolTokenPercentage
            ? poolInfoObj[obj].exchangeETHBalance
                .mul(poolInfoObj[obj].poolTokenPercentage)
                .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)))
            : undefined
    }
    
    poolTokenBalanceArr.push({
      name: allCoins[obj].name,
      symbol: obj,
      address: allCoins[obj].token,
      decimals: allCoins[obj].decimals,
      balance: poolInfoObj[obj].tokenShare,
      percent: poolInfoObj[obj].poolTokenPercentage,
      isSwitch: allCoins[obj].isSwitch,
      FSNCurPoolAllBalance: poolInfoObj[obj].exchangeETHBalance ? amountFormatter(
        poolInfoObj[obj].exchangeETHBalance,
        18,
        8
      ) : '',
      FSNCurPoolBalance: poolInfoObj[obj].ethShare ? amountFormatter(
        poolInfoObj[obj].ethShare,
        18,
        8
      ) : ''
    })
  }
  // console.log(poolTokenBalanceArr)
  function searchBox (type) {
    return (
      <>
        <SearchBox>
          <div className='icon'>
            <img src={SearchIcon} alt={''} />
          </div>
          <SearchInput
            placeholder={t('searchToken')}
            onChange={e => {
              if (type === 1) {
                setSearchBalance(e.target.value)
              } else {
                setSearchPool(e.target.value)
              }
            }}
          ></SearchInput>
        </SearchBox>
      </>
    )
  }
  function getFSNPoolInfo () {
    let allFSN = 0, curFSN = 0, percent = 0
    for (let obj of poolTokenBalanceArr) {
      allFSN += Number(obj.FSNCurPoolAllBalance) ? Number(obj.FSNCurPoolAllBalance) : 0
      curFSN += Number(obj.FSNCurPoolBalance) ? Number(obj.FSNCurPoolBalance) : 0
    }
    if (allFSN) {
      percent = (curFSN / allFSN) * 100
    }
    return {
      balance: curFSN ? Number(curFSN.toFixed(6)) : 0,
      percent: percent > 0.01 || percent === '' || percent === 0 ? Number(percent.toFixed(2)) : '<0.01'
    }
  }
  const FSNPool = getFSNPoolInfo()
  function getPoolToken () {
    // if (!account) return
    // console.log(tokenPoolList)
    let ANYItem = {}
    for (let i = 0,len = poolTokenBalanceArr.length; i < len; i++) {
      if (poolTokenBalanceArr[i].symbol === 'ANY') {
        ANYItem = poolTokenBalanceArr[i]
        poolTokenBalanceArr.splice(i, 1)
        break
      }
    }
    poolTokenBalanceArr.unshift(ANYItem)
    return (
      <MyBalanceTokenBox1>
        <TokenTableBox>
          {
            poolTokenBalanceArr.map((item, index) => {
              if (
                !searchPool
                || item.symbol.toLowerCase().indexOf(searchPool.toLowerCase()) !== -1
                || item.name.toLowerCase().indexOf(searchPool.toLowerCase()) !== -1
                || item.address.toLowerCase().indexOf(searchPool.toLowerCase()) !== -1
              ) {
                return (
                  <TokenTableList key={index}>
                    <TokenTableCoinBox>
                      <TokenTableLogo><TokenLogo address={item.symbol} size={'1.625rem'} ></TokenLogo></TokenTableLogo>
                      <TokenNameBox>
                        <h3>{item.symbol}</h3>
                        <p>{item.name}</p>
                      </TokenNameBox>
                    </TokenTableCoinBox>
                    <TokenBalanceBox>
                      <h3>{t('balances')}</h3>
                      {
                        item.symbol === 'FSN' ? (
                          <p>{account ? FSNPool.balance : '-'}</p>
                        ) : (
                          <p>{account ? (!!item.isSwitch ? 
                            amountFormatter(
                              item.balance,
                              item.decimals,
                              Math.min(6, item.decimals)
                            ) : '-'
                          ) : '-'}</p>
                        )
                      }
                    </TokenBalanceBox>
                    <TokenBalanceBox>
                      {
                        !!item.isSwitch ? (
                          <>
                            <h3>{t("Percentage")}</h3>
                            {
                              item.symbol === 'FSN' ? (
                                <p>{account ? FSNPool.percent + ' %' : '- %'}</p>
                              ) : (
                                <p>{
                                  item.percent ? amountFormatter(item.percent, 16, 2) : '-'
                                  } %</p>
                              )
                            }
                          </>
                        ) : (
                          <ComineSoon>
                          <img alt={''} src={ScheduleIcon} style={{marginRight: '10px'}} />
                          {t('ComineSoon')}
                          </ComineSoon>
                        )
                      }
                    </TokenBalanceBox>
                  </TokenTableList>
                )
              } else {
                return ''
              }
            })
          }
        </TokenTableBox>
      </MyBalanceTokenBox1>
    )
  }
  function getMyAccount () {
    // if (!account) return
    const myAccount = account ? allBalances[account] : ''
    
    let tokenList = Object.keys(allTokens).map(k => {
      // console.log(k)
      let balance = '-'
      // only update if we have data
      if (k === 'FSN' && myAccount && myAccount[k] && myAccount[k].value) {
        balance = formatEthBalance(ethers.utils.bigNumberify(myAccount[k].value))
      } else if (myAccount && myAccount[k] && myAccount[k].value) {
        balance = formatTokenBalance(ethers.utils.bigNumberify(myAccount[k].value), allTokens[k].decimals)
      }
      return {
        name: allTokens[k].name,
        symbol: allTokens[k].symbol,
        address: k,
        balance: balance,
        isSwitch: allTokens[k].isSwitch
      }
    })
    // console.log(tokenList)
    let ANYItem = {}
    for (let i = 0,len = tokenList.length; i < len; i++) {
      if (tokenList[i].symbol === 'ANY') {
        ANYItem = tokenList[i]
        tokenList.splice(i, 1)
        break
      }
    }
    tokenList.unshift(ANYItem)
    return (
        <TokenTableBox>
          {
            tokenList.map((item, index) => {
              if (
                !searchBalance
                || item.name.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1
                || item.symbol.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1
                || item.address.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1
              ) {
                return (
                  <TokenTableList key={index}>
                    <TokenTableCoinBox>
                      <TokenTableLogo><TokenLogo address={item.symbol} size={'1.625rem'} ></TokenLogo></TokenTableLogo>
                      <TokenNameBox>
                        <h3>{item.symbol}</h3>
                        <p>{item.name}</p>
                      </TokenNameBox>
                    </TokenTableCoinBox>
                    <TokenBalanceBox>
                      <h3>{t('balances')}</h3>
                      <p>{item.balance}</p>
                    </TokenBalanceBox>
                    <TokenActionBox>
                      {
                        !!item.isSwitch ? (
                          <>
                            <TokenActionBtnSwap to={'/swap?inputCurrency=' + item.address}>{t('swap')}</TokenActionBtnSwap>
                            <TokenActionBtnSend to={'/send?inputCurrency=' + item.address}>{t('send')}</TokenActionBtnSend>
                          </>
                        ) : (
                          <ComineSoon>
                          <img alt={''} src={ScheduleIcon} style={{marginRight: '10px'}} />
                          {t('ComineSoon')}
                          </ComineSoon>
                        )
                      }
                    </TokenActionBox>
                  </TokenTableList>
                )
              }
              return ''
            })
          }
        </TokenTableBox>
    )
  }
  return (
    <>
      <TitleBox>{t('dashboard')}</TitleBox>
      <MyBalanceBox>
        <TitleAndSearchBox>
          <h3>{t('myBalance')}</h3>
          {searchBox(1)}
        </TitleAndSearchBox>
        <MyBalanceTokenBox className={showMore ? 'showMore' : ''}>
          {getMyAccount()}
        </MyBalanceTokenBox>
        <MoreBtnBox onClick={() => {
          setShowMore(!showMore)
        }}>
          {
            showMore ? (
              <>
                <ColoredDropup></ColoredDropup>
                {t('pichUp')}
              </>
            ) : (
              <>
                <ColoredDropdown></ColoredDropdown>
                {t('showMore')}
              </>
            )
          }
        </MoreBtnBox>
      </MyBalanceBox>
      <WrapperBox>
        <EarningsBox>
          <div className='bgImg'><img src={AnyillustrationIcon} alt={''} /></div>
          <h3>{account ? '0.00' : '0.00'} ANY</h3>
          <p>{t('Accumulated')}</p>
          <div className='txt'>
            <img src={GraphUpIcon} alt={''} />
            <span>{account ? '0.00' : '0.00'}% </span>
            {t('last7Day')}
          </div>
        </EarningsBox>
        <ProvideLiqBox>
        <TitleAndSearchBox>
          <h3>{t('ProvidingLiquidity')}</h3>
          {searchBox(2)}
        </TitleAndSearchBox>
        {getPoolToken()}
        </ProvideLiqBox>
      </WrapperBox>
    </>
  )
}