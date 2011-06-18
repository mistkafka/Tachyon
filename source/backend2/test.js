function testx86Enc()
{
    // Test encodings for 32-bit and 64-bit
    function test(codeFunc, enc32, enc64)
    {
        // Test either a 32-bit or 64-bit encoding
        function testEnc(enc, x86_64)
        {
            // Report an encoding error
            function encError()
            {
                var expectBlock = new CodeBlock(enc.length);
                for (var i = 0; i < enc.length; ++i)
                    expectBlock.writeByte(enc[i]);

                error(
                    'invalid ' + (x86_64? 64:32) + '-bit encoding for:\n' +
                    assembler.toString() + '\n' +
                    '\n' +
                    'produced:\n' +
                    codeBlock.toString() + ' (' + codeBlock.size + ' bytes)\n' +
                    'expected:\n' +
                    expectBlock.toString() + ' (' + expectBlock.size + ' bytes)'
                );
            }

            // Create an assembler to write code into
            var assembler = new x86.Assembler(x86_64);

            // Produce the assembly
            codeFunc(assembler);

            // Assemble the code to a machine code block
            var codeBlock = assembler.assemble();

            // Check that the encoding length matches
            if (codeBlock.size !== enc.length)
                encError();

            // Compare all bytes in the block
            for (var i = 0; i < codeBlock.size; ++i)
            {
                if (codeBlock.readByte(i) !== enc[i])
                {
                    print(codeBlock.readByte(i));
                    print(enc[i]);
                    encError();
                }
            }
        }

        assert (
            !(enc64 === false && (enc32 === false || enc32 === undefined)),
            'no 32-bit or 64-bit encoding available for testing'
        );

        // Test the available 32-bit or 64-bit encodings
        if (enc32 !== false)
            testEnc(enc32, false);
        if (enc64 === undefined)
            testEnc(enc32, true);
        if (enc64 !== undefined && enc64 !== false)
            testEnc(enc64, true);
    }

    // add
    test(function (a) { a.add(a.al, 3); }, [0x04, 0x03]);
    // TODO: this actually uses a ModR/M byte
    //test(function (a) { a.add(a.eax, 3); }, [ ]);




    // mov
    test(function (a) { a.mov(a.eax, 7); }, [0xB8, 0x07, 0x00, 0x00, 0x00]);
    test(function (a) { a.mov(a.eax, -3); }, [0xB8, 0xFD, 0xFF, 0xFF, 0xFF]);

    // nop
    test(function (a) { a.nop(); }, [0x90]);

    // pop
    test(function (a) { a.pop(a.eax); }, [0x58], false);
    test(function (a) { a.pop(a.ebx); }, [0x5B], false);

    // push
    test(function (a) { a.push(a.eax); }, [0x50], false);
    test(function (a) { a.push(a.bx); }, [0x66, 0x53], false);
    test(function (a) { a.push(a.ebx); }, [0x53], false);
    test(function (a) { a.push(1); }, [0x6A, 0x01], false);

    // ret
    test(function (a) { a.ret(); }, [0xC3]);
    test(function (a) { a.ret(5); }, [0xC2, 0x05, 0x00]);
}

testx86Enc();






/*
var assembler = new x86.Assembler(false);

with (assembler)
{
    //push(eax);
    //push(ebx);

    //add(eax, ebx);

    push(eax);

    nop();

    ret();

    //pop(ebx);
    //pop(eax);
}

print('');
print('assembly: ');
print(assembler.toString(true));

// Assemble to code block
var codeBlock = assembler.assemble();

print('');
print('code block: ');
print(codeBlock.size + ' bytes');
print(codeBlock);
*/



/*
TODO: call, with callTachyonFFI?
var ret = callTachyonFFI(
    ['void*', 'int'],
    'void*',
    funcPtr, 
    ctxPtr,
    [heapAddr, heapSize]
);
*/



