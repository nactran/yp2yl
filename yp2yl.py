import re
initial = {
    'j':'y',
    'c':'ch',
    'z':'j',
}
final = {
    'eo':'eu',
    'oe':'eu',
    'eoi':'eui'
}
tone = {
    'a':['ā','á','a','à','á','a'],
    'e':['ē','é','e','è','é','e'],
    'i':['ī','í','i','ì','í','i'],
    'o':['ō','ó','o','ò','ó','o'],
    'u':['ū','ú','u','ù','ú','u'],
    'n':['n','ń','n','ǹ','ń','n'],
    'm':['m','ḿ','m','m̀ ','ḿ','m']
}
def yp2yl(w:str)->str:
    res = re.match( r'([bpmfdtnlgkhwzcsj]?[wg]?)([yaeiou]*)([ptknm]?g?)([1-6]?)', w, re.I)
    if res.group(1)=='' and res.group(2)=='' and res.group(3) =='':
        return '*error*'
    else:
        sm = '' #聲母
        yf = '' #韻腹
        yw = '' #韻尾
        '''
        處理特殊聲母
        '''
        if res.group(1)and(res.group(1)=='j' or res.group(1)=='c' or res.group(1)=='z'):
            sm = initial[res.group(1)]
        else:
            sm = res.group(1)
        '''
        處理韻腹
        '''
        if res.group(2):
            if(res.group(2)[0]=='y'and sm =='y'):
                sm = '' #處理y介音 避免重複

            if(res.group(2) =='oe' or res.group(2) =='eo' or res.group(2) =='eoi'):
                yf = final[res.group(2)]
            if res.group(2)=='aa' and not res.group(3):
                yf = 'a'
            else:
                yf = res.group(2)
        '''
        處理韻尾
        '''
        yw = res.group(3)
        '''
        處理聲調
        '''
        if res.group(4): #如果有標調
            t = int(res.group(4))
            if  (sm == 'ng' or sm == 'm')and not res.group(2):
                sm = tone[sm[0]][t-1]+sm[1:]
                if(t>=4):
                    return sm+'h'
                else:
                    return sm
            else:
                if yf:
                    if yf[0]!='y':
                        yf = tone[yf[0]][t-1]+yf[1:]
                        if(t>=4):
                            return sm+yf+'h'+yw
                        else:
                            return sm+yf+yw
                    else:
                        if len(yf)>1:
                            yf = tone[yf[1]][t-1]+yf[2:]
                            if(t>=4):
                                return sm+'y'+ yf+'h'+yw
                            else:
                                return sm+'y'+yf+yw
                        else:
                            return '*error*'
                else:
                    return '*error*'
        else: #如果沒有標調
            return '*error: no tone*'

if __name__ == '__main__':
    while True:
        l = input('Input a sentence in jyut6ping3 here. Use space to split words:\n')
        l = l.strip()
        if l == '\q':
            break
        else:
            irr = l.split(' ')
            res = ''
            for w in irr:
                res += yp2yl(w) + ' '
            print(res)

