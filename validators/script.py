import cpuinfo



import platform

kome = [platform.uname(),cpuinfo.get_cpu_info()['brand']]

print(kome)